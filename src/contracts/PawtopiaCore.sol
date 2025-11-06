// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PawtopiaCore
 * @dev Core NFT contract for Pawtopia Pet Game
 * @notice This contract manages Pet NFTs with breeding mechanics
 */
contract PawtopiaCore is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    // ============ State Variables ============
    
    Counters.Counter private _tokenIdCounter;
    
    // Breeding configuration
    uint256 public constant BREEDING_COOLDOWN = 24 hours;
    uint256 public constant MAX_GENERATION = 10;
    uint256 public breedingFee = 0.01 ether; // Can be adjusted by owner
    
    // Rarity levels
    enum Rarity { Common, Uncommon, Rare, Epic, Legendary, Mythic }
    
    // Species types
    enum Species { Cat, Dog, Rabbit, Hamster, Bird }
    
    // ============ Structs ============
    
    /**
     * @dev Pet attributes stored on-chain
     */
    struct Pet {
        string name;              // Pet's custom name
        Species species;          // Type of animal
        Rarity rarity;            // Rarity level
        uint8 generation;         // Breeding generation (0 = Genesis)
        uint256 parent1;          // First parent token ID (0 if Genesis)
        uint256 parent2;          // Second parent token ID (0 if Genesis)
        uint256 birthTime;        // Timestamp of creation
        uint256 lastBreedTime;    // Last time this pet was used for breeding
        uint16 breedCount;        // Number of times this pet has bred
        // On-chain stats for gameplay
        uint8 strength;           // Base stat: 1-100
        uint8 agility;            // Base stat: 1-100
        uint8 intelligence;       // Base stat: 1-100
    }
    
    // ============ Mappings & Storage ============
    
    // Token ID => Pet data
    mapping(uint256 => Pet) public pets;
    
    // Owner => array of owned pet IDs (for easy lookup)
    mapping(address => uint256[]) private _ownedPets;
    
    // Track breeding cooldowns
    mapping(uint256 => uint256) public breedingCooldowns;
    
    // Max breeds allowed per pet
    uint16 public constant MAX_BREEDS_PER_PET = 7;
    
    // ============ Events ============
    
    /**
     * @dev Emitted when a new pet is created
     */
    event PetCreated(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        Species species,
        Rarity rarity,
        uint8 generation,
        uint256 parent1,
        uint256 parent2
    );
    
    /**
     * @dev Emitted when two pets breed
     */
    event PetBred(
        uint256 indexed parent1TokenId,
        uint256 indexed parent2TokenId,
        uint256 indexed childTokenId,
        address breeder
    );
    
    /**
     * @dev Emitted when breeding fee is updated
     */
    event BreedingFeeUpdated(uint256 oldFee, uint256 newFee);
    
    /**
     * @dev Emitted when pet name is changed
     */
    event PetRenamed(uint256 indexed tokenId, string oldName, string newName);
    
    // ============ Constructor ============
    
    constructor() ERC721("Pawtopia Pet", "PAWT") Ownable(msg.sender) {
        // Start token IDs from 1
        _tokenIdCounter.increment();
    }
    
    // ============ Minting Functions ============
    
    /**
     * @dev Mints a Genesis (Gen 0) pet - Only owner can call
     * @param to Address to receive the pet
     * @param _name Pet's name
     * @param _species Species type
     * @param _rarity Rarity level
     * @param tokenURI Metadata URI (IPFS link)
     */
    function mintPet(
        address to,
        string memory _name,
        Species _species,
        Rarity _rarity,
        string memory tokenURI
    ) public onlyOwner whenNotPaused returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(_name).length > 0 && bytes(_name).length <= 32, "Invalid name length");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Generate random stats based on rarity
        (uint8 strength, uint8 agility, uint8 intelligence) = _generateStats(_rarity);
        
        // Create Pet struct
        pets[tokenId] = Pet({
            name: _name,
            species: _species,
            rarity: _rarity,
            generation: 0,
            parent1: 0,
            parent2: 0,
            birthTime: block.timestamp,
            lastBreedTime: 0,
            breedCount: 0,
            strength: strength,
            agility: agility,
            intelligence: intelligence
        });
        
        // Mint NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Track ownership
        _ownedPets[to].push(tokenId);
        
        emit PetCreated(tokenId, to, _name, _species, _rarity, 0, 0, 0);
        
        return tokenId;
    }
    
    /**
     * @dev Public minting with payment (for players)
     * @param _name Pet's name
     * @param _species Species type
     * @param tokenURI Metadata URI
     */
    function adoptPet(
        string memory _name,
        Species _species,
        string memory tokenURI
    ) public payable whenNotPaused nonReentrant returns (uint256) {
        require(msg.value >= 0.001 ether, "Insufficient payment for adoption");
        require(bytes(_name).length > 0 && bytes(_name).length <= 32, "Invalid name length");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Random rarity for public mints (weighted)
        Rarity rarity = _determineRandomRarity();
        
        // Generate stats
        (uint8 strength, uint8 agility, uint8 intelligence) = _generateStats(rarity);
        
        // Create Pet
        pets[tokenId] = Pet({
            name: _name,
            species: _species,
            rarity: rarity,
            generation: 0,
            parent1: 0,
            parent2: 0,
            birthTime: block.timestamp,
            lastBreedTime: 0,
            breedCount: 0,
            strength: strength,
            agility: agility,
            intelligence: intelligence
        });
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _ownedPets[msg.sender].push(tokenId);
        
        emit PetCreated(tokenId, msg.sender, _name, _species, rarity, 0, 0, 0);
        
        return tokenId;
    }
    
    // ============ Breeding Functions ============
    
    /**
     * @dev Breed two pets to create offspring
     * @param parent1Id First parent token ID
     * @param parent2Id Second parent token ID
     * @param childName Name for the new pet
     * @param tokenURI Metadata URI for child
     */
    function breed(
        uint256 parent1Id,
        uint256 parent2Id,
        string memory childName,
        string memory tokenURI
    ) public payable whenNotPaused nonReentrant returns (uint256) {
        // Validation checks
        require(msg.value >= breedingFee, "Insufficient breeding fee");
        require(ownerOf(parent1Id) == msg.sender, "You don't own parent 1");
        require(ownerOf(parent2Id) == msg.sender, "You don't own parent 2");
        require(parent1Id != parent2Id, "Cannot breed pet with itself");
        require(bytes(childName).length > 0 && bytes(childName).length <= 32, "Invalid name length");
        
        Pet storage pet1 = pets[parent1Id];
        Pet storage pet2 = pets[parent2Id];
        
        // Breeding restrictions
        require(pet1.breedCount < MAX_BREEDS_PER_PET, "Parent 1 has reached max breeds");
        require(pet2.breedCount < MAX_BREEDS_PER_PET, "Parent 2 has reached max breeds");
        require(block.timestamp >= pet1.lastBreedTime + BREEDING_COOLDOWN, "Parent 1 still in cooldown");
        require(block.timestamp >= pet2.lastBreedTime + BREEDING_COOLDOWN, "Parent 2 still in cooldown");
        
        // Calculate child generation
        uint8 childGeneration = (pet1.generation > pet2.generation ? pet1.generation : pet2.generation) + 1;
        require(childGeneration <= MAX_GENERATION, "Max generation reached");
        
        // Create child
        uint256 childId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Inherit traits
        Species childSpecies = _inheritSpecies(pet1.species, pet2.species);
        Rarity childRarity = _inheritRarity(pet1.rarity, pet2.rarity);
        (uint8 str, uint8 agi, uint8 intel) = _inheritStats(pet1, pet2);
        
        pets[childId] = Pet({
            name: childName,
            species: childSpecies,
            rarity: childRarity,
            generation: childGeneration,
            parent1: parent1Id,
            parent2: parent2Id,
            birthTime: block.timestamp,
            lastBreedTime: 0,
            breedCount: 0,
            strength: str,
            agility: agi,
            intelligence: intel
        });
        
        // Update parents
        pet1.lastBreedTime = block.timestamp;
        pet2.lastBreedTime = block.timestamp;
        pet1.breedCount++;
        pet2.breedCount++;
        
        // Mint child
        _safeMint(msg.sender, childId);
        _setTokenURI(childId, tokenURI);
        _ownedPets[msg.sender].push(childId);
        
        emit PetBred(parent1Id, parent2Id, childId, msg.sender);
        emit PetCreated(childId, msg.sender, childName, childSpecies, childRarity, childGeneration, parent1Id, parent2Id);
        
        return childId;
    }
    
    /**
     * @dev Check if a pet is ready to breed
     */
    function canBreed(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Pet does not exist");
        Pet memory pet = pets[tokenId];
        
        if (pet.breedCount >= MAX_BREEDS_PER_PET) return false;
        if (block.timestamp < pet.lastBreedTime + BREEDING_COOLDOWN) return false;
        
        return true;
    }
    
    /**
     * @dev Get time until pet can breed again
     */
    function getBreedingCooldownRemaining(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Pet does not exist");
        Pet memory pet = pets[tokenId];
        
        if (pet.lastBreedTime == 0) return 0;
        
        uint256 cooldownEnd = pet.lastBreedTime + BREEDING_COOLDOWN;
        if (block.timestamp >= cooldownEnd) return 0;
        
        return cooldownEnd - block.timestamp;
    }
    
    // ============ Pet Management Functions ============
    
    /**
     * @dev Rename your pet
     */
    function renamePet(uint256 tokenId, string memory newName) public {
        require(ownerOf(tokenId) == msg.sender, "You don't own this pet");
        require(bytes(newName).length > 0 && bytes(newName).length <= 32, "Invalid name length");
        
        string memory oldName = pets[tokenId].name;
        pets[tokenId].name = newName;
        
        emit PetRenamed(tokenId, oldName, newName);
    }
    
    /**
     * @dev Get all pets owned by an address
     */
    function getPetsOfOwner(address owner) public view returns (uint256[] memory) {
        return _ownedPets[owner];
    }
    
    /**
     * @dev Get full pet data
     */
    function getPet(uint256 tokenId) public view returns (Pet memory) {
        require(_exists(tokenId), "Pet does not exist");
        return pets[tokenId];
    }
    
    /**
     * @dev Get pet power level (for battles)
     */
    function getPetPower(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Pet does not exist");
        Pet memory pet = pets[tokenId];
        
        // Power calculation: sum of stats + rarity bonus + generation penalty
        uint256 baseStats = uint256(pet.strength) + uint256(pet.agility) + uint256(pet.intelligence);
        uint256 rarityBonus = uint256(pet.rarity) * 10;
        uint256 generationPenalty = uint256(pet.generation) * 2;
        
        return baseStats + rarityBonus - generationPenalty;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Update breeding fee
     */
    function setBreedingFee(uint256 newFee) public onlyOwner {
        uint256 oldFee = breedingFee;
        breedingFee = newFee;
        emit BreedingFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Withdraw contract funds
     */
    function withdraw() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }
    
    // ============ Internal Helper Functions ============
    
    /**
     * @dev Generate random stats based on rarity
     */
    function _generateStats(Rarity rarity) private view returns (uint8, uint8, uint8) {
        // Base stats range depends on rarity
        uint8 minStat = 30 + uint8(rarity) * 10;
        uint8 maxStat = 50 + uint8(rarity) * 10;
        
        uint8 strength = minStat + uint8(_randomNumber(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, "str")))) % (maxStat - minStat + 1));
        uint8 agility = minStat + uint8(_randomNumber(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, "agi")))) % (maxStat - minStat + 1));
        uint8 intelligence = minStat + uint8(_randomNumber(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, "int")))) % (maxStat - minStat + 1));
        
        return (strength, agility, intelligence);
    }
    
    /**
     * @dev Determine random rarity (weighted distribution)
     */
    function _determineRandomRarity() private view returns (Rarity) {
        uint256 rand = _randomNumber(block.timestamp) % 100;
        
        // Distribution: Common 40%, Uncommon 30%, Rare 15%, Epic 10%, Legendary 4%, Mythic 1%
        if (rand < 40) return Rarity.Common;
        if (rand < 70) return Rarity.Uncommon;
        if (rand < 85) return Rarity.Rare;
        if (rand < 95) return Rarity.Epic;
        if (rand < 99) return Rarity.Legendary;
        return Rarity.Mythic;
    }
    
    /**
     * @dev Inherit species from parents (70% chance of parent 1, 25% parent 2, 5% mutation)
     */
    function _inheritSpecies(Species parent1, Species parent2) private view returns (Species) {
        uint256 rand = _randomNumber(uint256(keccak256(abi.encodePacked(block.timestamp, "species")))) % 100;
        
        if (rand < 70) return parent1;
        if (rand < 95) return parent2;
        
        // 5% mutation - random species
        return Species(uint8(_randomNumber(block.timestamp) % 5));
    }
    
    /**
     * @dev Inherit rarity from parents (average with chance of upgrade)
     */
    function _inheritRarity(Rarity parent1, Rarity parent2) private view returns (Rarity) {
        uint8 avgRarity = (uint8(parent1) + uint8(parent2)) / 2;
        
        // 10% chance to upgrade rarity
        uint256 rand = _randomNumber(uint256(keccak256(abi.encodePacked(block.timestamp, "rarity")))) % 100;
        if (rand < 10 && avgRarity < 5) {
            avgRarity++;
        }
        
        return Rarity(avgRarity);
    }
    
    /**
     * @dev Inherit stats from parents (average ±10%)
     */
    function _inheritStats(Pet memory parent1, Pet memory parent2) private view returns (uint8, uint8, uint8) {
        uint8 avgStr = (parent1.strength + parent2.strength) / 2;
        uint8 avgAgi = (parent1.agility + parent2.agility) / 2;
        uint8 avgInt = (parent1.intelligence + parent2.intelligence) / 2;
        
        // Add variance ±10%
        uint8 variance = 10;
        
        uint8 str = _applyVariance(avgStr, variance, "str");
        uint8 agi = _applyVariance(avgAgi, variance, "agi");
        uint8 intel = _applyVariance(avgInt, variance, "int");
        
        return (str, agi, intel);
    }
    
    /**
     * @dev Apply random variance to a stat
     */
    function _applyVariance(uint8 baseStat, uint8 variancePercent, string memory salt) private view returns (uint8) {
        uint8 variance = (baseStat * variancePercent) / 100;
        int8 adjustment = int8(uint8(_randomNumber(uint256(keccak256(abi.encodePacked(block.timestamp, salt)))) % (variance * 2 + 1))) - int8(variance);
        
        int16 newStat = int16(int8(baseStat)) + int16(adjustment);
        if (newStat < 1) newStat = 1;
        if (newStat > 100) newStat = 100;
        
        return uint8(uint16(newStat));
    }
    
    /**
     * @dev Simple pseudo-random number generator
     * @notice NOT SECURE - For production, use Chainlink VRF
     */
    function _randomNumber(uint256 seed) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            seed,
            _tokenIdCounter.current()
        )));
    }
    
    // ============ Overrides ============
    
    /**
     * @dev Override transfer to update ownership tracking
     */
    function _update(address to, uint256 tokenId, address auth) 
        internal 
        override 
        returns (address) 
    {
        address from = _ownerOf(tokenId);
        
        // Update owned pets tracking
        if (from != address(0) && from != to) {
            _removeFromOwnedPets(from, tokenId);
        }
        if (to != address(0) && from != to) {
            _ownedPets[to].push(tokenId);
        }
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Remove token from owned pets array
     */
    function _removeFromOwnedPets(address owner, uint256 tokenId) private {
        uint256[] storage ownedTokens = _ownedPets[owner];
        for (uint256 i = 0; i < ownedTokens.length; i++) {
            if (ownedTokens[i] == tokenId) {
                ownedTokens[i] = ownedTokens[ownedTokens.length - 1];
                ownedTokens.pop();
                break;
            }
        }
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Check if token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
