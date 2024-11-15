
// Unit tests for: connect




const mongoose = require("mongoose");
const mongoose = require("mongoose");
const { connect } = require("../path/to/your/module");
const { connect } = require('../database');

jest.mock("mongoose", () => ({
    connect: jest.fn(),
}));

describe('connect() connect method', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Happy Path", () => {
        it("should successfully connect to the database", async () => {
            // Arrange
            mongoose.connect.mockResolvedValueOnce();

            // Act
            await connect();

            // Assert
            expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URL);
            expect(mongoose.connect).toHaveBeenCalledTimes(1);
        });
    });

    describe("Edge Cases", () => {
        it("should handle connection errors gracefully", async () => {
            // Arrange
            const error = new Error("Connection failed");
            mongoose.connect.mockRejectedValueOnce(error);

            // Act
            await connect();

            // Assert
            expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URL);
            expect(mongoose.connect).toHaveBeenCalledTimes(1);
        });
    });
});

// End of unit tests for: connect
