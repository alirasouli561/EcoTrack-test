import { obtenirClassement } from '../../src/controllers/classementController.js';
import * as leaderboardService from '../../src/services/leaderboard.service.js';

jest.mock('../../src/services/leaderboard.service.js');

const mockRequest = ({ query = {} } = {}) => ({
  query
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('classementController', () => {
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renvoie le classement avec la limite demandée', async () => {
    const req = mockRequest({ query: { limite: '5' } });
    const res = mockResponse();
    leaderboardService.recupererClassement.mockResolvedValue({ classement: [] });

    await obtenirClassement(req, res, next);

    expect(leaderboardService.recupererClassement).toHaveBeenCalledWith({
      limite: 5,
      idUtilisateur: undefined
    });
    expect(res.json).toHaveBeenCalledWith({ classement: [] });
  });
});
