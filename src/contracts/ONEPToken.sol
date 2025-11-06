// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ONEPToken
 * @dev ERC20 utility token for Pawtopia game ecosystem
 * @notice ONEP is the primary currency for in-game transactions and rewards
 */
contract ONEPToken is ERC20, ERC20Burnable, Ownable, Pausable {
    
    // ============ Constants ============
    
    // Maximum supply cap (optional - can be unlimited with proper burn mechanics)
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion ONEP
    
    // Initial distribution amounts
    uint256 public constant INITIAL_REWARDS_POOL = 400_000_000 * 10**18; // 40%
    uint256 public constant INITIAL_STAKING_POOL = 200_000_000 * 10**18; // 20%
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10**18;      // 15%
    uint256 public constant MARKETING_ALLOCATION = 150_000_000 * 10**18; // 15%
    uint256 public constant LIQUIDITY_POOL = 100_000_000 * 10**18;       // 10%
    
    // ============ State Variables ============
    
    // Authorized game contracts that can mint rewards
    mapping(address => bool) public gameContracts;
    
    // Reward pool tracking
    uint256 public rewardsPoolBalance;
    uint256 public stakingPoolBalance;
    
    // Anti-whale: max transaction amount (can be disabled)
    uint256 public maxTransactionAmount;
    bool public maxTransactionEnabled;
    
    // Reward claiming tracking
    mapping(address => uint256) public lastClaimTime;
    uint256 public constant CLAIM_COOLDOWN = 1 hours;
    
    // ============ Events ============
    
    event GameContractAuthorized(address indexed gameContract);
    event GameContractRevoked(address indexed gameContract);
    event RewardsClaimed(address indexed player, uint256 amount);
    event RewardsPoolFunded(uint256 amount);
    event StakingPoolFunded(uint256 amount);
    event MaxTransactionUpdated(uint256 newAmount);
    
    // ============ Constructor ============
    
    constructor() ERC20("Pawtopia Token", "ONEP") Ownable(msg.sender) {
        // Initial distribution
        _mint(msg.sender, TEAM_ALLOCATION);
        _mint(msg.sender, MARKETING_ALLOCATION);
        _mint(msg.sender, LIQUIDITY_POOL);
        
        // Allocate to rewards and staking pools
        rewardsPoolBalance = INITIAL_REWARDS_POOL;
        stakingPoolBalance = INITIAL_STAKING_POOL;
        _mint(address(this), INITIAL_REWARDS_POOL + INITIAL_STAKING_POOL);
        
        // Set initial max transaction (5% of initial supply)
        maxTransactionAmount = 50_000_000 * 10**18;
        maxTransactionEnabled = false; // Disabled by default
    }
    
    // ============ Game Integration Functions ============
    
    /**
     * @dev Authorize a game contract to mint rewards
     * @param gameContract Address of the game contract
     */
    function authorizeGameContract(address gameContract) external onlyOwner {
        require(gameContract != address(0), "Invalid address");
        require(!gameContracts[gameContract], "Already authorized");
        
        gameContracts[gameContract] = true;
        emit GameContractAuthorized(gameContract);
    }
    
    /**
     * @dev Revoke game contract authorization
     */
    function revokeGameContract(address gameContract) external onlyOwner {
        require(gameContracts[gameContract], "Not authorized");
        
        gameContracts[gameContract] = false;
        emit GameContractRevoked(gameContract);
    }
    
    /**
     * @dev Mint rewards to player (only callable by authorized game contracts)
     * @param player Address receiving rewards
     * @param amount Amount of ONEP to mint
     */
    function mintReward(address player, uint256 amount) external whenNotPaused {
        require(gameContracts[msg.sender], "Not authorized game contract");
        require(player != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(rewardsPoolBalance >= amount, "Insufficient rewards pool");
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        
        rewardsPoolBalance -= amount;
        _transfer(address(this), player, amount);
        
        emit RewardsClaimed(player, amount);
    }
    
    /**
     * @dev Fund rewards pool
     */
    function fundRewardsPool(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be positive");
        
        _transfer(msg.sender, address(this), amount);
        rewardsPoolBalance += amount;
        
        emit RewardsPoolFunded(amount);
    }
    
    /**
     * @dev Fund staking pool
     */
    function fundStakingPool(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be positive");
        
        _transfer(msg.sender, address(this), amount);
        stakingPoolBalance += amount;
        
        emit StakingPoolFunded(amount);
    }
    
    // ============ Token Management ============
    
    /**
     * @dev Enable/disable max transaction limit
     */
    function setMaxTransactionEnabled(bool enabled) external onlyOwner {
        maxTransactionEnabled = enabled;
    }
    
    /**
     * @dev Update max transaction amount
     */
    function setMaxTransactionAmount(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be positive");
        maxTransactionAmount = amount;
        emit MaxTransactionUpdated(amount);
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ============ Overrides ============
    
    /**
     * @dev Override transfer to add max transaction check
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        // Skip checks for minting and burning
        if (from != address(0) && to != address(0) && maxTransactionEnabled) {
            require(amount <= maxTransactionAmount, "Transfer amount exceeds maximum");
        }
        
        super._update(from, to, amount);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get available rewards pool
     */
    function getRewardsPoolBalance() external view returns (uint256) {
        return rewardsPoolBalance;
    }
    
    /**
     * @dev Get available staking pool
     */
    function getStakingPoolBalance() external view returns (uint256) {
        return stakingPoolBalance;
    }
    
    /**
     * @dev Check if address is authorized game contract
     */
    function isGameContract(address addr) external view returns (bool) {
        return gameContracts[addr];
    }
    
    /**
     * @dev Get token info
     */
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 decimals,
        uint256 totalSupply,
        uint256 maxSupply
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            MAX_SUPPLY
        );
    }
}
