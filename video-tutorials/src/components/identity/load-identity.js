const identityProjection = {
  $init() {
    return {
      id: null,
      email: null,
      isRegistered: false,
    };
  },
  Registered(identity, registered) {
    identity.id = registered.data.userId;
    identity.email = registered.data.email;
    identity.isRegistered = true;
    return identity;
  },
  Locked(identity, locked) {
    identity.lockedTime = locked.data.lockedTime;
    return identity;
  },
}

function loadIdentity(context) {
  const { identityId, messageStore } = context;
  const identityStreamName = `identity-${identityId}`;
  return messageStore
    .fetch(identityStreamName, identityProjection)
    .then(identity => {
      context.identity = identity
      return context
    });
}

module.exports = loadIdentity