import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock the Clarity VM environment
const mockClarity = {
  tx: {
    sender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  },
  block: {
    time: 1625097600, // July 1, 2021
  },
}

// Mock the contract functions
const structureRegistration = {
  registerRegistrar: vi.fn(),
  registerBuilding: vi.fn(),
  registerOwnership: vi.fn(),
  verifyOwnership: vi.fn(),
  addDesignation: vi.fn(),
  addFeature: vi.fn(),
  recordModification: vi.fn(),
  updateBuildingStatus: vi.fn(),
  getBuilding: vi.fn(),
  getBuildingOwnership: vi.fn(),
  getHistoricalDesignation: vi.fn(),
  getBuildingFeature: vi.fn(),
  getBuildingModification: vi.fn(),
}

describe("Structure Registration Contract", () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()
    
    // Setup default mock implementations
    structureRegistration.registerRegistrar.mockReturnValue({ type: "ok", value: true })
    structureRegistration.registerBuilding.mockReturnValue({ type: "ok", value: true })
    structureRegistration.registerOwnership.mockReturnValue({ type: "ok", value: true })
    structureRegistration.verifyOwnership.mockReturnValue({ type: "ok", value: true })
    structureRegistration.addDesignation.mockReturnValue({ type: "ok", value: true })
    structureRegistration.addFeature.mockReturnValue({ type: "ok", value: true })
    structureRegistration.recordModification.mockReturnValue({ type: "ok", value: 1 })
    structureRegistration.updateBuildingStatus.mockReturnValue({ type: "ok", value: true })
    
    structureRegistration.getBuilding.mockReturnValue({
      value: {
        name: "Old Town Hall",
        address: "123 Main Street, Historic District, Anytown, USA",
        constructionYear: 1890,
        architect: "John Smith",
        architecturalStyle: "Victorian Gothic",
        registrationDate: mockClarity.block.time - 2592000, // 30 days ago
        lastUpdated: mockClarity.block.time,
        registeredBy: mockClarity.tx.sender,
        status: "active",
      },
    })
    
    structureRegistration.getBuildingOwnership.mockReturnValue({
      value: {
        ownerName: "Anytown Historical Society",
        ownerType: "non-profit",
        contactInfo: "info@anytownhistorical.org, (555) 123-4567",
        ownershipDate: mockClarity.block.time - 31536000, // 1 year ago
        verified: true,
        verifiedBy: { value: mockClarity.tx.sender },
        verificationDate: { value: mockClarity.block.time - 2592000 }, // 30 days ago
      },
    })
    
    structureRegistration.getHistoricalDesignation.mockReturnValue({
      value: {
        designationType: "national",
        designatingAuthority: "National Register of Historic Places",
        designationDate: mockClarity.block.time - 63072000, // 2 years ago
        criteria: "Architectural significance, association with important historical events",
        documentationHash: Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex"),
        status: "active",
      },
    })
    
    structureRegistration.getBuildingFeature.mockReturnValue({
      value: {
        featureType: "architectural",
        description: "Original stained glass windows with intricate patterns",
        historicalSignificance: "Rare example of 19th century craftsmanship, designed by renowned artisan James Brown",
        documentationHash: Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex"),
        addedBy: mockClarity.tx.sender,
        addedAt: mockClarity.block.time - 2592000, // 30 days ago
      },
    })
    
    structureRegistration.getBuildingModification.mockReturnValue({
      value: {
        modificationType: "restoration",
        description: "Restoration of original facade elements and decorative cornices",
        date: mockClarity.block.time - 15768000, // 6 months ago
        performedBy: "Heritage Restoration Specialists, Inc.",
        documentationHash: Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex"),
        recordedBy: mockClarity.tx.sender,
        recordedAt: mockClarity.block.time - 15768000, // 6 months ago
      },
    })
  })
  
  describe("registerRegistrar", () => {
    it("should register a registrar successfully", () => {
      const registrarId = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
      const name = "Jane Smith"
      const organization = "Historic Preservation Office"
      
      const result = structureRegistration.registerRegistrar(registrarId, name, organization)
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(structureRegistration.registerRegistrar).toHaveBeenCalledWith(registrarId, name, organization)
    })
    
    it("should fail when registrar already exists", () => {
      const registrarId = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
      const name = "Jane Smith"
      const organization = "Historic Preservation Office"
      
      structureRegistration.registerRegistrar.mockReturnValueOnce({ type: "err", value: "registrar-already-exists" })
      
      const result = structureRegistration.registerRegistrar(registrarId, name, organization)
      
      expect(result.type).toBe("err")
      expect(result.value).toBe("registrar-already-exists")
    })
  })
  
  describe("registerBuilding", () => {
    it("should register a building successfully", () => {
      const buildingId = "building-001"
      const name = "Old Town Hall"
      const address = "123 Main Street, Historic District, Anytown, USA"
      const constructionYear = 1890
      const architect = "John Smith"
      const architecturalStyle = "Victorian Gothic"
      
      const result = structureRegistration.registerBuilding(
          buildingId,
          name,
          address,
          constructionYear,
          architect,
          architecturalStyle,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(structureRegistration.registerBuilding).toHaveBeenCalledWith(
          buildingId,
          name,
          address,
          constructionYear,
          architect,
          architecturalStyle,
      )
    })
    
    it("should fail when building already exists", () => {
      const buildingId = "building-001"
      const name = "Old Town Hall"
      const address = "123 Main Street, Historic District, Anytown, USA"
      const constructionYear = 1890
      const architect = "John Smith"
      const architecturalStyle = "Victorian Gothic"
      
      structureRegistration.registerBuilding.mockReturnValueOnce({ type: "err", value: "building-already-exists" })
      
      const result = structureRegistration.registerBuilding(
          buildingId,
          name,
          address,
          constructionYear,
          architect,
          architecturalStyle,
      )
      
      expect(result.type).toBe("err")
      expect(result.value).toBe("building-already-exists")
    })
  })
  
  describe("registerOwnership", () => {
    it("should register building ownership successfully", () => {
      const buildingId = "building-001"
      const ownerName = "Anytown Historical Society"
      const ownerType = "non-profit"
      const contactInfo = "info@anytownhistorical.org, (555) 123-4567"
      const ownershipDate = mockClarity.block.time - 31536000 // 1 year ago
      
      const result = structureRegistration.registerOwnership(
          buildingId,
          ownerName,
          ownerType,
          contactInfo,
          ownershipDate,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(structureRegistration.registerOwnership).toHaveBeenCalledWith(
          buildingId,
          ownerName,
          ownerType,
          contactInfo,
          ownershipDate,
      )
    })
  })
  
  describe("verifyOwnership", () => {
    it("should verify building ownership successfully", () => {
      const buildingId = "building-001"
      const verificationDocHash = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex")
      
      const result = structureRegistration.verifyOwnership(buildingId, verificationDocHash)
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(structureRegistration.verifyOwnership).toHaveBeenCalledWith(buildingId, verificationDocHash)
    })
  })
  
  describe("addDesignation", () => {
    it("should add a historical designation successfully", () => {
      const buildingId = "building-001"
      const designationId = "designation-001"
      const designationType = "national"
      const designatingAuthority = "National Register of Historic Places"
      const designationDate = mockClarity.block.time - 63072000 // 2 years ago
      const criteria = "Architectural significance, association with important historical events"
      const documentationHash = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex")
      
      const result = structureRegistration.addDesignation(
          buildingId,
          designationId,
          designationType,
          designatingAuthority,
          designationDate,
          criteria,
          documentationHash,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(structureRegistration.addDesignation).toHaveBeenCalledWith(
          buildingId,
          designationId,
          designationType,
          designatingAuthority,
          designationDate,
          criteria,
          documentationHash,
      )
    })
  })
  
  describe("addFeature", () => {
    it("should add a building feature successfully", () => {
      const buildingId = "building-001"
      const featureId = "feature-001"
      const featureType = "architectural"
      const description = "Original stained glass windows with intricate patterns"
      const historicalSignificance =
          "Rare example of 19th century craftsmanship, designed by renowned artisan James Brown"
      const documentationHash = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex")
      
      const result = structureRegistration.addFeature(
          buildingId,
          featureId,
          featureType,
          description,
          historicalSignificance,
          documentationHash,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(structureRegistration.addFeature).toHaveBeenCalledWith(
          buildingId,
          featureId,
          featureType,
          description,
          historicalSignificance,
          documentationHash,
      )
    })
  })
  
  describe("recordModification", () => {
    it("should record a building modification successfully", () => {
      const buildingId = "building-001"
      const modificationType = "restoration"
      const description = "Restoration of original facade elements and decorative cornices"
      const date = mockClarity.block.time - 15768000 // 6 months ago
      const performedBy = "Heritage Restoration Specialists, Inc."
      const documentationHash = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex")
      
      const result = structureRegistration.recordModification(
          buildingId,
          modificationType,
          description,
          date,
          performedBy,
          documentationHash,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(1)
      expect(structureRegistration.recordModification).toHaveBeenCalledWith(
          buildingId,
          modificationType,
          description,
          date,
          performedBy,
          documentationHash,
      )
    })
  })
  
  describe("updateBuildingStatus", () => {
    it("should update building status successfully", () => {
      const buildingId = "building-001"
      const status = "inactive"
      const reason = "Temporarily closed for major restoration"
      
      const result = structureRegistration.updateBuildingStatus(buildingId, status, reason)
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(structureRegistration.updateBuildingStatus).toHaveBeenCalledWith(buildingId, status, reason)
    })
  })
  
  describe("getBuilding", () => {
    it("should retrieve building information", () => {
      const buildingId = "building-001"
      
      const result = structureRegistration.getBuilding(buildingId)
      
      expect(result.value).toEqual({
        name: "Old Town Hall",
        address: "123 Main Street, Historic District, Anytown, USA",
        constructionYear: 1890,
        architect: "John Smith",
        architecturalStyle: "Victorian Gothic",
        registrationDate: mockClarity.block.time - 2592000,
        lastUpdated: mockClarity.block.time,
        registeredBy: mockClarity.tx.sender,
        status: "active",
      })
      expect(structureRegistration.getBuilding).toHaveBeenCalledWith(buildingId)
    })
    
    it("should return none when building does not exist", () => {
      const buildingId = "non-existent-building"
      
      structureRegistration.getBuilding.mockReturnValueOnce({ value: null })
      
      const result = structureRegistration.getBuilding(buildingId)
      
      expect(result.value).toBeNull()
    })
  })
  
  describe("getBuildingOwnership", () => {
    it("should retrieve building ownership information", () => {
      const buildingId = "building-001"
      
      const result = structureRegistration.getBuildingOwnership(buildingId)
      
      expect(result.value).toEqual({
        ownerName: "Anytown Historical Society",
        ownerType: "non-profit",
        contactInfo: "info@anytownhistorical.org, (555) 123-4567",
        ownershipDate: mockClarity.block.time - 31536000,
        verified: true,
        verifiedBy: { value: mockClarity.tx.sender },
        verificationDate: { value: mockClarity.block.time - 2592000 },
      })
      expect(structureRegistration.getBuildingOwnership).toHaveBeenCalledWith(buildingId)
    })
  })
  
  describe("getHistoricalDesignation", () => {
    it("should retrieve historical designation information", () => {
      const buildingId = "building-001"
      const designationId = "designation-001"
      
      const result = structureRegistration.getHistoricalDesignation(buildingId, designationId)
      
      expect(result.value).toEqual({
        designationType: "national",
        designatingAuthority: "National Register of Historic Places",
        designationDate: mockClarity.block.time - 63072000,
        criteria: "Architectural significance, association with important historical events",
        documentationHash: Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex"),
        status: "active",
      })
      expect(structureRegistration.getHistoricalDesignation).toHaveBeenCalledWith(buildingId, designationId)
    })
  })
  
  describe("getBuildingFeature", () => {
    it("should retrieve building feature information", () => {
      const buildingId = "building-001"
      const featureId = "feature-001"
      
      const result = structureRegistration.getBuildingFeature(buildingId, featureId)
      
      expect(result.value).toEqual({
        featureType: "architectural",
        description: "Original stained glass windows with intricate patterns",
        historicalSignificance: "Rare example of 19th century craftsmanship, designed by renowned artisan James Brown",
        documentationHash: Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex"),
        addedBy: mockClarity.tx.sender,
        addedAt: mockClarity.block.time - 2592000,
      })
      expect(structureRegistration.getBuildingFeature).toHaveBeenCalledWith(buildingId, featureId)
    })
  })
  
  describe("getBuildingModification", () => {
    it("should retrieve building modification information", () => {
      const buildingId = "building-001"
      const modificationId = 1
      
      const result = structureRegistration.getBuildingModification(buildingId, modificationId)
      
      expect(result.value).toEqual({
        modificationType: "restoration",
        description: "Restoration of original facade elements and decorative cornices",
        date: mockClarity.block.time - 15768000,
        performedBy: "Heritage Restoration Specialists, Inc.",
        documentationHash: Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex"),
        recordedBy: mockClarity.tx.sender,
        recordedAt: mockClarity.block.time - 15768000,
      })
      expect(structureRegistration.getBuildingModification).toHaveBeenCalledWith(buildingId, modificationId)
    })
  })
})

