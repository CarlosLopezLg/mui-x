import { TreeViewContextValue } from '@mui/x-tree-view/internals/TreeViewProvider';
import { SimpleTreeViewPluginSignatures } from '@mui/x-tree-view/SimpleTreeView/SimpleTreeView.plugins';

export const getFakeContextValue = (
  features: { checkboxSelection?: boolean } = {},
): TreeViewContextValue<SimpleTreeViewPluginSignatures> => ({
  instance: {
    isItemExpandable: () => false,
    isItemExpanded: () => false,
    isItemFocused: () => false,
    isItemSelected: () => false,
    isItemDisabled: (itemId: string | null): itemId is string => !!itemId,
    mapFirstCharFromJSX: () => () => {},
    canItemBeTabbed: () => false,
  } as any,
  publicAPI: {
    focusItem: () => {},
    getItem: () => ({}),
    getItemOrderedChildrenIds: () => [],
    setItemExpansion: () => {},
    getItemDOMElement: () => null,
    selectItem: () => {},
    getItemTree: () => [],
  },
  runItemPlugins: () => ({
    rootRef: null,
    contentRef: null,
    propsEnhancers: {},
  }),
  wrapItem: ({ children }) => children,
  wrapRoot: ({ children }) => children,
  items: {
    disabledItemsFocusable: false,
  },
  icons: {
    slots: {},
    slotProps: {},
  },
  selection: {
    multiSelect: false,
    checkboxSelection: features.checkboxSelection ?? false,
    disableSelection: false,
    selectionPropagation: {},
  },
  treeId: 'mui-tree-view-1',
  rootRef: {
    current: null,
  },
  expansion: { expansionTrigger: 'content' },
});
