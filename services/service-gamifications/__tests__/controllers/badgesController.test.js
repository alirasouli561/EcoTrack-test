import { obtenirBadges, obtenirBadgesUtilisateur } from '../../src/controllers/badgesController.js';
import * as badgesService from '../../src/services/badges.service.js';

jest.mock('../../src/services/badges.service.js');

const mockRequest = ({ params = {}, query = {} } = {}) => ({
  params,
  query
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('badgesController', () => {
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renvoie le catalogue des badges', async () => {
    const req = mockRequest();
    const res = mockResponse();
    badgesService.listerBadges.mockResolvedValue([{ code: 'DEBUTANT' }]);

    await obtenirBadges(req, res, next);

    expect(res.json).toHaveBeenCalledWith([{ code: 'DEBUTANT' }]);
  });

  it('renvoie les badges d\'un utilisateur', async () => {
    const req = mockRequest({ params: { idUtilisateur: '2' } });
    const res = mockResponse();
    badgesService.listerBadgesUtilisateur.mockResolvedValue([{ code: 'DEBUTANT' }]);

    await obtenirBadgesUtilisateur(req, res, next);

    expect(badgesService.listerBadgesUtilisateur).toHaveBeenCalledWith(2);
    expect(res.json).toHaveBeenCalledWith([{ code: 'DEBUTANT' }]);
  });
});
