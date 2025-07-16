const mockRedisClient = {
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(true),
    isReady: true, 
};

export default mockRedisClient;