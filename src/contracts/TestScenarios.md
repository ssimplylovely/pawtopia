# Testing Scenarios untuk Pawtopia Contracts

## 🧪 Quick Test di Remix IDE

### Setup
1. Upload semua file `.sol` ke Remix
2. Compile dengan Solidity 0.8.20+
3. Deploy contracts di JavaScript VM atau testnet

---

## Test Case 1: Deploy & Initial Setup

### Steps:
```solidity
1. Deploy ONEPToken
   - Verify initial supply
   - Check owner balance
   - Verify rewards pool = 400M ONEP

2. Deploy PawtopiaCore
   - Verify contract name = "Pawtopia Pet"
   - Check symbol = "PAWT"

3. Link contracts
   - Call ONEPToken.authorizeGameContract(PawtopiaCore.address)
   - Verify isGameContract() returns true
```

### Expected Results:
✅ Both contracts deployed successfully
✅ ONEP total supply = 1B tokens
✅ Game contract authorized

---

## Test Case 2: Minting Genesis Pets (Admin)

### Steps:
```solidity
// Using owner account
1. Call mintPet()
   Parameters:
   - to: 0xUserAddress
   - name: "Genesis Cat"
   - species: 0 (Cat)
   - rarity: 4 (Legendary)
   - tokenURI: "ipfs://QmTest123"

2. Verify PetCreated event emitted

3. Call getPet(1)
   - Check pet.name = "Genesis Cat"
   - Check pet.generation = 0
   - Check pet.parent1 = 0
   - Check pet.parent2 = 0

4. Call getPetsOfOwner(userAddress)
   - Should return [1]
```

### Expected Results:
✅ Pet #1 minted to user
✅ Pet is Genesis (Gen 0)
✅ Stats generated based on Legendary rarity (high values)

---

## Test Case 3: Public Adoption

### Steps:
```solidity
// Switch to user account
1. Call adoptPet() with 0.001 ETH
   Parameters:
   - name: "Lucky"
   - species: 1 (Dog)
   - tokenURI: "ipfs://QmTest456"
   Value: 0.001 ether

2. Verify transaction succeeds

3. Check balanceOf(userAddress) = 1 (or more if already has pets)

4. Call getPet(tokenId)
   - Verify name = "Lucky"
   - Verify species = Dog
   - Verify rarity is randomly assigned
```

### Expected Results:
✅ Payment of 0.001 ETH accepted
✅ Pet minted to user
✅ Rarity randomly determined

### Negative Tests:
❌ Try adoptPet() with 0 ETH → Should fail
❌ Try adoptPet() with empty name → Should fail
❌ Try adoptPet() with name > 32 chars → Should fail

---

## Test Case 4: Breeding System

### Setup:
```solidity
// Mint two pets for breeding
1. Mint Pet #1: Cat, Rare, Gen 0
2. Mint Pet #2: Dog, Rare, Gen 0
```

### Steps:
```solidity
1. Check canBreed(1) → Should return true
2. Check canBreed(2) → Should return true

3. Call breed() with 0.01 ETH
   Parameters:
   - parent1Id: 1
   - parent2Id: 2
   - childName: "Hybrid"
   - tokenURI: "ipfs://QmChild"
   Value: 0.01 ether

4. Verify PetBred event emitted

5. Check child pet (should be token #3)
   - generation = 1
   - parent1 = 1
   - parent2 = 2
   - species inherited from parents

6. Check parent stats updated
   - parent1.breedCount = 1
   - parent2.breedCount = 1
   - parent1.lastBreedTime = current timestamp
```

### Expected Results:
✅ Breeding successful
✅ Child is Gen 1
✅ Parents updated correctly
✅ Species inherited (70% parent1, 25% parent2, 5% random)
✅ Stats are average of parents ±10%

### Negative Tests:
❌ Try breed same pet with itself → Should fail
❌ Try breed with insufficient fee → Should fail
❌ Try breed immediately after → Should fail (cooldown)
❌ Try breed pet you don't own → Should fail

---

## Test Case 5: Breeding Cooldown

### Steps:
```solidity
1. After breeding in Test Case 4

2. Check getBreedingCooldownRemaining(1)
   - Should return ~86400 seconds (24 hours)

3. Try to breed again immediately
   - Should fail with "Parent still in cooldown"

4. Fast-forward time (in JavaScript VM)
   - Use evm_increaseTime(86400)
   - Use evm_mine()

5. Check canBreed(1) again
   - Should return true

6. Try breeding again
   - Should succeed
```

### Expected Results:
✅ Cooldown enforced (24 hours)
✅ Cannot breed during cooldown
✅ Can breed after cooldown expires

---

## Test Case 6: Max Breeding Limit

### Steps:
```solidity
1. Breed pet #1 seven times (MAX_BREEDS_PER_PET = 7)
   - Each time wait for cooldown or fast-forward

2. After 7th breed, check pet1.breedCount = 7

3. Try to breed 8th time
   - Should fail with "Parent has reached max breeds"

4. Verify canBreed(1) returns false
```

### Expected Results:
✅ Pet can breed 7 times maximum
✅ 8th breed attempt fails
✅ canBreed() correctly identifies exhausted pets

---

## Test Case 7: Generation Limit

### Steps:
```solidity
// Create breeding chain to reach Gen 10
1. Mint Gen 0 pets (A, B)
2. Breed A+B → Gen 1 (C, D)
3. Breed C+D → Gen 2 (E, F)
4. Continue breeding offspring...
5. Eventually reach Gen 9 pets

6. Try to breed Gen 9 pets
   - Should fail with "Max generation reached"
```

### Expected Results:
✅ Can breed up to Gen 9
✅ Cannot create Gen 11
✅ Generation properly calculated from parents

---

## Test Case 8: Pet Renaming

### Steps:
```solidity
1. Own pet #1 with name "OldName"

2. Call renamePet(1, "NewName")

3. Verify PetRenamed event emitted

4. Check getPet(1).name = "NewName"
```

### Expected Results:
✅ Name changed successfully
✅ Event emitted

### Negative Tests:
❌ Try rename pet you don't own → Should fail
❌ Try rename with empty string → Should fail
❌ Try rename with 50-char name → Should fail

---

## Test Case 9: Pet Stats & Power

### Steps:
```solidity
1. Mint Legendary Cat (high rarity)
2. Check pet stats
   - strength should be 70-100
   - agility should be 70-100
   - intelligence should be 70-100

3. Call getPetPower(tokenId)
   Formula: (str + agi + int) + (rarity × 10) - (generation × 2)
   
   Example:
   - Stats: 80 + 85 + 90 = 255
   - Rarity: Legendary (4) × 10 = 40
   - Generation: 0 × 2 = 0
   - Power = 255 + 40 - 0 = 295

4. Verify power calculation correct
```

### Expected Results:
✅ Stats match rarity level
✅ Power calculated correctly
✅ Higher rarity = higher power

---

## Test Case 10: NFT Transfer & Ownership Tracking

### Steps:
```solidity
1. User A owns pet #1

2. Check getPetsOfOwner(userA) = [1]

3. Transfer pet to User B
   - Call transferFrom(userA, userB, 1)

4. Check ownership updated
   - ownerOf(1) = userB
   - getPetsOfOwner(userA) = []
   - getPetsOfOwner(userB) = [1]
```

### Expected Results:
✅ Transfer successful
✅ Ownership arrays updated correctly
✅ New owner can interact with pet

---

## Test Case 11: Admin Functions

### Steps:
```solidity
1. setBreedingFee(0.02 ether)
   - Verify breedingFee updated

2. pause()
   - Try to mint → Should fail
   - Try to breed → Should fail

3. unpause()
   - Minting works again

4. withdraw()
   - Check contract balance transferred to owner
```

### Expected Results:
✅ Only owner can call admin functions
✅ Pause stops all minting/breeding
✅ Unpause restores functionality
✅ Withdraw transfers ETH to owner

---

## Test Case 12: ONEP Token Integration

### Steps:
```solidity
1. Deploy ONEPToken

2. Authorize PawtopiaCore as game contract
   - ONEPToken.authorizeGameContract(pawtopiaCore.address)

3. Mock reward distribution
   // In real game, this would be called by game contract
   - ONEPToken.mintReward(player, 100 * 10**18)

4. Check player balance
   - balanceOf(player) = 100 ONEP

5. Player uses ONEP for breeding
   // Future: integrate ONEP payment instead of ETH
```

### Expected Results:
✅ Game contract can mint rewards
✅ Players receive ONEP tokens
✅ Rewards pool decreases appropriately

---

## Test Case 13: Rarity Distribution

### Steps:
```solidity
// Mint 100 pets via adoptPet() and track rarity
1. Loop 100 times calling adoptPet()

2. Count rarity distribution:
   - Common: ~40%
   - Uncommon: ~30%
   - Rare: ~15%
   - Epic: ~10%
   - Legendary: ~4%
   - Mythic: ~1%

3. Verify distribution roughly matches expected
```

### Expected Results:
✅ Rarity weighted correctly
✅ Mythic is rarest
✅ Common is most frequent

---

## Test Case 14: Edge Cases

### Test Empty Adoption Fee:
```solidity
adoptPet("Test", 0, "ipfs://") with 0 ETH
→ Should fail
```

### Test Breeding Same Pet:
```solidity
breed(1, 1, "Child", "ipfs://")
→ Should fail "Cannot breed pet with itself"
```

### Test Non-Owner Breeding:
```solidity
User A owns pets 1, 2
User B tries breed(1, 2, ...)
→ Should fail "You don't own parent"
```

### Test Zero Address Minting:
```solidity
mintPet(0x0, "Test", 0, 0, "ipfs://")
→ Should fail "Cannot mint to zero address"
```

---

## 📊 Performance Metrics

Track gas usage for each operation:

| Operation | Estimated Gas |
|-----------|---------------|
| deployPawtopiaCore | ~3,500,000 |
| deployONEPToken | ~2,000,000 |
| mintPet | ~200,000 |
| adoptPet | ~220,000 |
| breed | ~350,000 |
| renamePet | ~50,000 |
| transfer | ~80,000 |
| approve | ~45,000 |

---

## 🐛 Known Issues to Test

1. **Pseudo-Random Security**:
   - Current RNG is NOT secure
   - Can be predicted/manipulated
   - Test with Chainlink VRF integration

2. **Front-Running**:
   - Breeding can be front-run
   - Test with higher gas prices

3. **Large Arrays**:
   - getPetsOfOwner() gas increases with collection size
   - Test with 100+ pets per owner

---

## ✅ Success Criteria

All tests should pass:
- ✅ Genesis pets mint correctly
- ✅ Public adoption works with payment
- ✅ Breeding enforces all rules
- ✅ Cooldown works as expected
- ✅ Max breeding limit enforced
- ✅ Generation limit respected
- ✅ Stats and power calculated correctly
- ✅ Ownership tracking accurate
- ✅ Admin functions protected
- ✅ All negative tests fail properly

---

## 🚀 Next Steps After Testing

1. Deploy to testnet (Goerli/Sepolia)
2. Get contract verified on Etherscan
3. Integrate with frontend
4. Add Chainlink VRF for secure randomness
5. Deploy to mainnet
6. Set up monitoring and alerts

---

**Happy Testing! 🧪🐾**
