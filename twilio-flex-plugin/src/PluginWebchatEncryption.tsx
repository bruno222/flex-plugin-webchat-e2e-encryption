import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import CustomTaskList from './components/CustomTaskList/CustomTaskList';

const PLUGIN_NAME = 'plugin-webchat-e2e-encryption';

export default class PluginWebchatEncryption extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const options: Flex.ContentFragmentProps = { sortOrder: -1 };
    flex.AgentDesktopView.Panel1.Content.add(<CustomTaskList key="FlexPlugin-component" />, options);
  }
}
