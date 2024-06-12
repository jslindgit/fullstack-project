import React, { ReactNode, MouseEvent } from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../redux/rootReducer';

import localstorageHandler from '../util/localstorageHandler';

import { tickNotification } from '../redux/miscReducer';
import { contentToText } from '../types/languageFunctions';
import { ContentID } from '../content';

interface CustomLinkProps extends ReactRouterLinkProps {
    to: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    children: ReactNode;
    className?: 'link' | 'menuLink';
    blank?: boolean;
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, onClick, children, className = 'link', blank = false, ...rest }) => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const notification = miscState.notification;

    const currentPath = useLocation().pathname + useLocation().search;

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
        <>
            <ReactRouterLink
                to={to}
                onClick={handleClick}
                {...rest}
                className={className}
                title={blank ? contentToText(ContentID.linkOpensInNewTab, config) : ''}
                target={blank ? '_blank' : '_self'}
            >
                {children}
            </ReactRouterLink>
        </>
    );
};

export { CustomLink as Link };
