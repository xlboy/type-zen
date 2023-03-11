import useUrlState from '@ahooksjs/use-url-state';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { tw } from 'twind';

import type { ExampleSource } from '../data/example';
import { exampleSource } from '../data/example';
import { useGlobalStore } from '../store';

type MenuItem = Required<MenuProps>['items'][number];

//  将 menuSourceOfExample 转换成 antd Menu 所需的数据结构
function convertMenuSourceToAntdMenuItems(
  exampleSource: ReadonlyArray<ExampleSource.Index>
): MenuItem[] {
  return exampleSource.map(item => {
    if ('children' in item) {
      return {
        key: item.key,
        label: item.name,
        children: convertMenuSourceToAntdMenuItems(item.children)
      };
    } else {
      return {
        key: item.key,
        label: item.name
      };
    }
  });
}

const items = convertMenuSourceToAntdMenuItems(exampleSource);

function ExampleMenu(): JSX.Element {
  const { activatedTab, setActivatedTab } = useGlobalStore();
  const [, setUrlState] = useUrlState({ example: '', code: '' });

  return (
    <div className={tw`h-full min-w-[200px]`}>
      <Menu
        style={{ width: '100%' }}
        selectedKeys={activatedTab ? [activatedTab] : []}
        mode="inline"
        items={items}
        onSelect={info => handleSelect(info.key)}
      />
    </div>
  );

  function handleSelect(key: string) {
    setActivatedTab(key);
    setUrlState({
      example: key,
      code: undefined
    });
  }
}

export default ExampleMenu;
