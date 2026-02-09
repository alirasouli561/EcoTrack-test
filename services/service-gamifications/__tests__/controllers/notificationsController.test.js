import {
  creerNotificationHandler,
  listerNotificationsHandler
} from '../../src/controllers/notificationsController.js';
import * as notificationsService from '../../src/services/notifications.service.js';

jest.mock('../../src/services/notifications.service.js');

const mockRequest = ({ body = {}, query = {} } = {}) => ({
  body,
  query
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('notificationsController', () => {
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('crée une notification et renvoie 201', async () => {
    const req = mockRequest({
      body: {
        id_utilisateur: 1,
        type: 'BADGE',
        titre: 'Badge',
        corps: 'Bravo'
      }
    });
    const res = mockResponse();
    notificationsService.creerNotification.mockResolvedValue({ id_notification: 1 });

    await creerNotificationHandler(req, res, next);

    expect(notificationsService.creerNotification).toHaveBeenCalledWith({
      idUtilisateur: 1,
      type: 'BADGE',
      titre: 'Badge',
      corps: 'Bravo'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id_notification: 1 });
  });

  it('liste les notifications d\'un utilisateur', async () => {
    const req = mockRequest({ query: { id_utilisateur: '2' } });
    const res = mockResponse();
    notificationsService.listerNotifications.mockResolvedValue([{ id_notification: 1 }]);

    await listerNotificationsHandler(req, res, next);

    expect(notificationsService.listerNotifications).toHaveBeenCalledWith({ idUtilisateur: 2 });
    expect(res.json).toHaveBeenCalledWith([{ id_notification: 1 }]);
  });
});
