import useUrlState from '@ahooksjs/use-url-state';
import { useMount, useUpdateEffect } from 'ahooks';
import { tw } from 'twind';

import ExampleMenu from './components/ExampleMenu';
import TSPreview from './components/TSPreview';
import TypeZenEditor from './components/TypeZenEditor';
import { useGlobalStore } from './store';
import { codeCompression } from './utils';

function App() {
  const [urlState, setUrlState] = useUrlState({ example: '', code: '' });
  const { activatedTab, setActivatedTab, setZenCode } = useGlobalStore();

  useMount(() => {
    if (urlState.code) {
      setZenCode(codeCompression.inflate(decodeURIComponent(urlState.code)));
    } else {
      if (urlState.example) {
        setActivatedTab(urlState.example);
      } else {
        setUrlState({ example: 'basic' });
        setActivatedTab('basic');
      }
    }
  });

  useUpdateEffect(() => {
    setUrlState({ example: activatedTab });
  }, [activatedTab]);

  return (
    <div className={tw`h-[100vh] w-full flex(& col)`}>
      <div
        className={tw`w-full h-[50px] bg-[#3372c6] text([#fff] [30px]) flex-none px-[20px]`}
      >
        TypeZen Playground
      </div>
      <div className={tw('w-full p-[3px] flex(& 1)')}>
        <ExampleMenu />
        <TypeZenEditor />
        <TSPreview />
      </div>
    </div>
  );
}

export default App;
