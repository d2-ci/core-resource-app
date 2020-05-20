import { getInstance as getD2 } from 'd2/lib/d2';
import Action from '../action/Action';
import sharingStore from './sharing.store';

var actions = Action.createActionsFromNames(['externalAccessChanged', 'loadObjectSharingState', 'publicAccessChanged', 'userGroupAcessesChanged', 'saveChangedState']);

actions.externalAccessChanged.subscribe(function (_ref) {
    var data = _ref.data;

    sharingStore.setState(Object.assign({}, sharingStore.getState(), { externalAccess: data }));

    actions.saveChangedState();
});

actions.loadObjectSharingState.subscribe(function (_ref2) {
    var sharableObject = _ref2.data,
        complete = _ref2.complete,
        error = _ref2.error;

    if (!sharableObject.modelDefinition || !sharableObject.modelDefinition.name) {
        error({
            actionName: 'sharing.loadObjectSharingState',
            message: 'shareableObject should contain a modelDefinition property'
        });
    }

    var objectType = sharableObject.modelDefinition.name;

    getD2().then(function (d2) {
        var api = d2.Api.getApi();

        return api.get('sharing', { type: objectType, id: sharableObject.id }, { contentType: 'text/plain' });
    }).then(function (_ref3) {
        var meta = _ref3.meta,
            object = _ref3.object;

        var sharableState = {
            objectType: objectType,
            meta: meta,
            user: object.user,
            externalAccess: object.externalAccess,
            publicAccess: object.publicAccess,
            userGroupAccesses: object.userGroupAccesses || []
        };
        sharableState.model = sharableObject;
        sharableState.isSaving = false;
        sharingStore.setState(sharableState);
    }).then(complete).catch(error);
});

actions.publicAccessChanged.subscribe(function (_ref4) {
    var publicAccess = _ref4.data;

    sharingStore.setState(Object.assign({}, sharingStore.getState(), { publicAccess: publicAccess }));

    actions.saveChangedState();
});

actions.userGroupAcessesChanged.subscribe(function (_ref5) {
    var userGroupAccesses = _ref5.data;

    sharingStore.setState(Object.assign({}, sharingStore.getState(), { userGroupAccesses: userGroupAccesses }));

    actions.saveChangedState();
});

function saveSharingToServer(action) {
    return getD2().then(function (d2) {
        var api = d2.Api.getApi();

        var _sharingStore$getStat = sharingStore.getState(),
            meta = _sharingStore$getStat.meta,
            model = _sharingStore$getStat.model,
            externalAccess = _sharingStore$getStat.externalAccess,
            publicAccess = _sharingStore$getStat.publicAccess,
            userGroupAccesses = _sharingStore$getStat.userGroupAccesses,
            objectType = _sharingStore$getStat.objectType;

        var sharingDataToPost = {
            meta: meta,
            object: {
                externalAccess: externalAccess,
                publicAccess: publicAccess,
                userGroupAccesses: userGroupAccesses.filter(function (userGroupAccess) {
                    if (userGroupAccess.access !== '--------') {
                        return true;
                    }
                    return false;
                })
            }
        };

        return api.post('sharing?type=' + objectType + '&id=' + model.id, sharingDataToPost).then(function (_ref6) {
            var httpStatus = _ref6.httpStatus,
                message = _ref6.message;

            if (httpStatus === 'OK') {
                action.complete(message);
            } else {
                action.error(message);
            }
            return message;
        }).catch(function (_ref7) {
            var message = _ref7.message;

            action.error(message);
            return message;
        });
    });
}

actions.saveChangedState.debounceTime(500).map(saveSharingToServer).concatAll().subscribe(function () {
    actions.loadObjectSharingState(sharingStore.getState().model);
});

export default actions;