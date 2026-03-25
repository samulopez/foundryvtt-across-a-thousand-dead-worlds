import { ID, KEYBINDINGS } from './constants';
import { getGame, getLocalization } from './helpers';

export const registerSettings = () => {
  getGame().keybindings?.register(ID, KEYBINDINGS.modifyRoll, {
    name: getLocalization().localize('ATDW.keybindings.modifyRoll'),
    hint: getLocalization().localize('ATDW.keybindings.modifyRollHint'),
    editable: [
      {
        key: 'ControlLeft',
      },
    ],
    onDown: () => {},
    onUp: () => {},
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
};
