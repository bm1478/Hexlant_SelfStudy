pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    // Testing the adopt() function
    function testUserCanAdoptPet() public{
        uint expected = 8;
        uint returnedId = adoption.adopt(8);
        Assert.equal(returnedId, expected, "Adoption of pet ID 8 should be recorded.");
    }

    // Testing retrieval of a single pet's owner
    function testGetAdopterAddressByPetId() public {
        // Expected owner is this contract
        address expected = address(this);
        address adopter = adoption.adopters(8);
        Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
    }

    // Testing retrieval of all pet owners
    function testGetAdopterAddressByPetInArray() public {
        // Expected owner if this contract
        address expected = address(this);
        // Stroe adopters in memory rather than contract's storage
        address[16] memory adopters = adoption.getAdopters();
        Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded");
    }
}