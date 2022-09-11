import * as React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';

// define IconComponent, color, sizes and OverflowIcon in one place
const AntDesignHeaderButton = (props) => (
    <HeaderButton IconComponent={AntDesign} iconSize={23} color="blue" {...props} />
);

export const AntDesignHeaderButtons = (props) => {
    return <HeaderButtons HeaderButtonComponent={AntDesignHeaderButton} {...props} />;
};