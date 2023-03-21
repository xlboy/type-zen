import useUrlState from '@ahooksjs/use-url-state';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { tw } from 'twind';

import type { Example, ExampleKey } from '../data/example';
import { examples } from '../data/example';
import { useGlobalStore } from '../store';

type MenuItem = Required<MenuProps>['items'][number];

function getAntdMenuItems(examples: ReadonlyArray<Example.Index>): MenuItem[] {
  return examples.map(item => {
    if ('children' in item) {
      return {
        key: item.key,
        label: item.name,
        children: getAntdMenuItems(item.children)
      };
    } else {
      return {
        key: item.key,
        label: item.name
      };
    }
  });
}

const antdMenuItems = getAntdMenuItems(examples);

function ExampleMenu(): JSX.Element {
  const { activatedTab, setActivatedTab } = useGlobalStore();
  const [, setUrlState] = useUrlState({ example: '', code: '' });

  return (
    <div className={tw`h-full min-w-[300px] overflow-auto`}>
      <Menu
        style={{ width: '100%' }}
        selectedKeys={activatedTab ? [activatedTab] : []}
        mode="inline"
        items={antdMenuItems}
        onSelect={info => handleSelect(info.key as ExampleKey)}
      />
    </div>
  );

  function handleSelect(key: ExampleKey) {
    setActivatedTab(key);
    setUrlState({
      example: key,
      code: undefined
    });
  }
}

export default ExampleMenu;
