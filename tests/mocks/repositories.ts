export const mockQuestionRepository: any = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
};

export const mockUserRepository: any = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};
