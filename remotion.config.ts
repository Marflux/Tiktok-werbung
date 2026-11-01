import {Config} from '@remotion/cli/config';
import {existsSync, readdirSync} from 'node:fs';
import path from 'node:path';

// In the cloud Remotion cannot download its own Chrome, so use the pre-installed one if it is there.
const pw = '/opt/pw-browsers';
if (existsSync(pw)) {
  const dir = readdirSync(pw).find((d) => d.startsWith('chromium_headless_shell'));
  const exe = dir && [path.join(pw, dir, 'chrome-linux', 'headless_shell'), path.join(pw, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell')].find((p) => existsSync(p));
  if (exe) Config.setBrowserExecutable(exe);
}
Config.setVideoImageFormat('jpeg');
