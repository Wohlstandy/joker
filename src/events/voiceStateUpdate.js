import { handleTemporaryVoiceState } from '../utils/tempVoiceManager.js';

export default {
  name: 'voiceStateUpdate',

  async execute(oldState, newState) {
    await handleTemporaryVoiceState(oldState, newState);
  }
};
