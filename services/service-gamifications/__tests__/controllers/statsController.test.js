import { obtenirStatsUtilisateur } from '../../src/controllers/statsController.js';
import * as statsService from '../../src/services/stats.service.js';

jest.mock('../../src/services/stats.service.js');

const mockRequest = ({ params = {} } = {}) => ({
  params
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('statsController', () => {
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renvoie les statistiques utilisateur', async () => {
    const req = mockRequest({ params: { idUtilisateur: '3' } });
    const res = mockResponse();
    statsService.recupererStatsUtilisateur.mockResolvedValue({ totalPoints: 30 });

    await obtenirStatsUtilisateur(req, res, next);

    expect(statsService.recupererStatsUtilisateur).toHaveBeenCalledWith({ idUtilisateur: 3 });
    expect(res.json).toHaveBeenCalledWith({ totalPoints: 30 });
  });
});
