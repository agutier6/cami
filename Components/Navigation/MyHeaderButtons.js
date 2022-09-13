import * as React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import { theme } from '../../styles/theme';

// define IconComponent, color, sizes and OverflowIcon in one place
const AntDesignHeaderButton = (props) => (
    <HeaderButton IconComponent={AntDesign} iconSize={23} color={theme.colors.primary.p500} {...props} />
);

export const AntDesignHeaderButtons = (props) => {
    return <HeaderButtons HeaderButtonComponent={AntDesignHeaderButton} {...props} />;
};