import React, { ReactNode, MouseEvent } from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../reducers/root_reducer';

import { tickNotification } from '../reducers/misc_reducer';

interface CustomLinkProps extends ReactRouterLinkProps {
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    children: ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, onClick, children, ...rest }) => {
    const dispatch = useDispatch();
    const miscState = useSelector((state: RootState) => state.misc);
    const notification = miscState.notification;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
        if (onClick) {
            onClick(event);
        }

        if (notification) {
            dispatch(tickNotification());
        }
    };

    return (
        <ReactRouterLink to={to} onClick={handleClick} {...rest}>
            {children}
        </ReactRouterLink>
    );
};

export { CustomLink as Link };
