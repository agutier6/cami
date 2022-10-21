import * as React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import { theme } from '../../styles/theme';
import { useWindowDimensions } from 'react-native';

// define IconComponent, color, sizes and OverflowIcon in one place
const AntDesignHeaderButton = ({ color, ...props }) => {
    const layout = useWindowDimensions();
    return <HeaderButton IconComponent={AntDesign} iconSize={layout.height * 0.0275} color={color ? color : theme.colors.primary.p500} {...props} />
};

export const AntDesignHeaderButtons = (props) => {
    return <HeaderButtons HeaderButtonComponent={AntDesignHeaderButton} {...props} />;
};