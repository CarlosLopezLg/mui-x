'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { PickersActionBar, PickersActionBarAction } from '../PickersActionBar';
import { PickerLayoutOwnerState, PickersLayoutProps, SubComponents } from './PickersLayout.types';
import { getPickersLayoutUtilityClass, PickersLayoutClasses } from './pickersLayoutClasses';
import { PickersShortcuts } from '../PickersShortcuts';
import { BaseToolbarProps } from '../internals/models/props/toolbar';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

function toolbarHasView<TValue, TView extends DateOrTimeViewWithMeridiem>(
  toolbarProps: BaseToolbarProps<TValue, TView> | any,
): toolbarProps is BaseToolbarProps<TValue, TView> {
  return toolbarProps.view !== null;
}

const useUtilityClasses = (
  classes: Partial<PickersLayoutClasses> | undefined,
  ownerState: PickerLayoutOwnerState,
) => {
  const { isLandscape } = ownerState;
  const slots = {
    root: ['root', isLandscape && 'landscape'],
    contentWrapper: ['contentWrapper'],
    toolbar: ['toolbar'],
    actionBar: ['actionBar'],
    tabs: ['tabs'],
    landscape: ['landscape'],
    shortcuts: ['shortcuts'],
  };

  return composeClasses(slots, getPickersLayoutUtilityClass, classes);
};

interface PickersLayoutPropsWithValueRequired<TValue, TView extends DateOrTimeViewWithMeridiem>
  extends PickersLayoutProps<TValue, TView> {
  value: TValue;
}
interface UsePickerLayoutResponse<TValue> extends SubComponents<TValue> {}

const usePickerLayout = <TValue, TView extends DateOrTimeViewWithMeridiem>(
  props: PickersLayoutProps<TValue, TView>,
): UsePickerLayoutResponse<TValue> => {
  const { ownerState: pickersOwnerState } = usePickerPrivateContext();

  const {
    wrapperVariant,
    onAccept,
    onClear,
    onCancel,
    onSetToday,
    view,
    views,
    onViewChange,
    value,
    onChange,
    onSelectShortcut,
    isValid,
    isLandscape,
    disabled,
    readOnly,
    children,
    slots,
    slotProps,
    classes: classesProp,
    // TODO: Remove this "as" hack. It get introduced to mark `value` prop in PickersLayoutProps as not required.
    // The true type should be
    // - For pickers value: PickerValidDate | null
    // - For range pickers value: [PickerValidDate | null, PickerValidDate | null]
  } = props as PickersLayoutPropsWithValueRequired<TValue, TView>;

  const ownerState: PickerLayoutOwnerState = {
    ...pickersOwnerState,
    wrapperVariant,
    isLandscape,
  };
  const classes = useUtilityClasses(classesProp, ownerState);

  // Action bar
  const ActionBar = slots?.actionBar ?? PickersActionBar;
  const actionBarProps = useSlotProps({
    elementType: ActionBar,
    externalSlotProps: slotProps?.actionBar,
    additionalProps: {
      onAccept,
      onClear,
      onCancel,
      onSetToday,
      actions:
        wrapperVariant === 'desktop' ? [] : (['cancel', 'accept'] as PickersActionBarAction[]),
    },
    className: classes.actionBar,
    ownerState,
  });
  const actionBar = <ActionBar {...actionBarProps} />;

  // Toolbar
  const Toolbar = slots?.toolbar;
  const toolbarProps = useSlotProps({
    elementType: Toolbar!,
    externalSlotProps: slotProps?.toolbar,
    additionalProps: {
      isLandscape,
      onChange,
      value,
      view,
      onViewChange,
      views,
      disabled,
      readOnly,
    },
    className: classes.toolbar,
    ownerState,
  });
  const toolbar = toolbarHasView(toolbarProps) && !!Toolbar ? <Toolbar {...toolbarProps} /> : null;

  // Content
  const content = children;

  // Tabs
  const Tabs = slots?.tabs;
  const tabs =
    view && Tabs ? (
      <Tabs view={view} onViewChange={onViewChange} className={classes.tabs} {...slotProps?.tabs} />
    ) : null;

  // Shortcuts
  const Shortcuts = slots?.shortcuts ?? PickersShortcuts;
  const shortcutsProps = useSlotProps({
    elementType: Shortcuts!,
    externalSlotProps: slotProps?.shortcuts,
    additionalProps: {
      isValid,
      isLandscape,
      onChange: onSelectShortcut,
    },
    className: classes.shortcuts,
    ownerState,
  });
  const shortcuts = view && !!Shortcuts ? <Shortcuts {...shortcutsProps} /> : null;

  return {
    toolbar,
    content,
    tabs,
    actionBar,
    shortcuts,
  };
};

export default usePickerLayout;
