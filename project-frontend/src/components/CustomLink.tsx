import React, { ReactNode, MouseEvent } from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import localstorageHandler from '../util/localstorageHandler';

import { tickNotification } from '../reducers/miscReducer';

interface CustomLinkProps extends ReactRouterLinkProps {
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    children: ReactNode;
    className?: 'link' | 'menuLink';
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, onClick, children, className = 'link', ...rest }) => {
    const dispatch = useDispatch();
    const miscState = useSelector((state: RootState) => state.misc);
    const notification = miscState.notification;

    const currentPath = useLocation().pathname;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
        if (onClick) {
            onClick(event);
        }

        if (currentPath !== to) {
            localstorageHandler.setPreviousLocation(currentPath);
        }

        if (notification) {
            dispatch(tickNotification());
        }
    };

    return (
        <ReactRouterLink to={to} onClick={handleClick} {...rest} className={className}>
            {children}
        </ReactRouterLink>
    );
};

export { CustomLink as Link };
