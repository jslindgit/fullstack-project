import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';
import { User } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';
import useField from '../../hooks/useField';
import { getUserStatus } from '../../util/userProvider';

import { useUserGetAllQuery } from '../../redux/slices/userSlice';

import { Link } from '../CustomLink';
import InputField from '../InputField';
import LoadingQuery from '../LoadingQuery';
import SortArrow from '../SortArrow';

interface Props {
    config: Config;
    user: User;
}
const AdminUserGridRow = ({ config, user }: Props) => {
    return (
        <div className={'buttonHighlight displayContents' + (user.admin ? ' bold' : user.operator ? ' semiBold' : '')}>
            <div>{user.contactFirstName + ' ' + user.contactLastName}</div>
            <div className='adminUsersListBreakWord'>{user.username}</div>
            <div>{user.id}</div>
            <div>{getUserStatus(user, config)}</div>
            <div className='alignRight'>
                <Link to={'/admin/users/' + user.id}>
                    <button type='button'>{contentToText(ContentID.buttonShowInfo, config)}</button>
                </Link>
            </div>
        </div>
    );
};

const AdminUsers = () => {
    type sortByOption = 'name' | 'username' | 'id' | 'status';

    const userGetAll = useUserGetAllQuery();

    const config = useSelector((state: RootState) => state.config);

    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [sortBy, setSortBy] = useState<sortByOption>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortedUsers, setSortedUsers] = useState<User[]>([]);

    const search = useField('text', ContentID.miscSearch);

    const setSorting = (by: sortByOption) => {
        if (sortBy !== by) {
            setSortBy(by);
        } else {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
    };

    // Filter Users according to search field value:
    useEffect(() => {
        if (userGetAll.data) {
            // prettier-ignore
            setFilteredUsers(
                search.value.toString().trim().length > 0
                    ?
                    userGetAll.data.filter(
                        (user) =>
                            user.contactFirstName.toLowerCase().includes(search.value.toString().trim().toLowerCase()) ||
                            user.contactLastName.toLowerCase().includes(search.value.toString().trim().toLowerCase()) ||
                            user.username.toLowerCase().includes(search.value.toString().trim().toLowerCase())
                    )
                    : userGetAll.data
            );
        }
    }, [search.value, userGetAll.data]);

    // Sort Users:
    useEffect(() => {
        switch (sortBy) {
            case 'id':
                setSortedUsers([...filteredUsers].sort((a, b) => (sortDirection === 'asc' ? a.id - b.id : b.id - a.id)));
                break;
            case 'name':
                setSortedUsers(
                    [...filteredUsers].sort((a, b) =>
                        sortDirection === 'asc' ? a.contactLastName.localeCompare(b.contactLastName) : b.contactLastName.localeCompare(a.contactLastName)
                    )
                );
                break;
            case 'status':
                setSortedUsers(
                    [...filteredUsers].sort((a, b) =>
                        sortDirection === 'asc'
                            ? getUserStatus(a, config).localeCompare(getUserStatus(b, config))
                            : getUserStatus(b, config).localeCompare(getUserStatus(a, config))
                    )
                );
                break;
            case 'username':
                setSortedUsers(
                    [...filteredUsers].sort((a, b) => (sortDirection === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username)))
                );
                break;
            default:
                setSortedUsers(filteredUsers);
                break;
        }
    }, [config, filteredUsers, sortBy, sortDirection]);

    const gridColumnHeader = (label: ContentID, sortByOption: sortByOption, breakWord: boolean = false) => (
        <div className={breakWord ? 'adminUsersListBreakWord' : ''} onClick={() => setSorting(sortByOption)}>
            <span
                className='clickable'
                title={contentToText(sortBy === sortByOption ? ContentID.miscClickToChangeSortingOrder : ContentID.miscClickToSortByThis, config)}
            >
                {contentToText(label, config)}
            </span>{' '}
            <SortArrow column={sortByOption} sortBy={sortBy} sortDirection={sortDirection} setSortDirection={setSortDirection} config={config} />
        </div>
    );

    if (!userGetAll.data) {
        return <LoadingQuery query={userGetAll} config={config} />;
    }

    return (
        <div className='grid-container pageWidth' data-gap='2rem'>
            <div className='flex-container left searchBox' data-gap='1rem 2rem'>
                <div className='semiBold'>{contentToText(search.label, config)}:</div>
                <div>
                    <InputField
                        useField={search}
                        width={'20rem'}
                        placeHolder={contentToText(ContentID.miscName, config) + ', ' + contentToText(ContentID.contactEmail, config)}
                    />
                </div>
                <div>
                    <button type='button' onClick={() => search.setNewValue('')}>
                        {contentToText(ContentID.buttonClear, config)}
                    </button>
                </div>
            </div>
            {sortedUsers.length > 0 ? (
                <>
                    <div className='adminUsersList grid-container left middle stripedBackground' data-cols='users'>
                        <div className='displayContents gridHeaderRowDarkGray'>
                            {gridColumnHeader(ContentID.miscName, 'name')}
                            {gridColumnHeader(ContentID.loginUsername, 'username')}
                            {gridColumnHeader(ContentID.accountUserId, 'id', true)}
                            {gridColumnHeader(ContentID.userStatusHeader, 'status')}
                            <div />
                        </div>
                        {sortedUsers.map((user) => (
                            <AdminUserGridRow key={user.id} config={config} user={user} />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className='semiBold sizeLarge'>
                        <span>
                            {`${contentToText(ContentID.adminUsersNoUsers, config)} ${contentToText(ContentID.miscWithSearchWords, config)} `}{' '}
                            <span className='italic'>{`'${search.stringValue()}'`}</span>.
                        </span>
                    </div>
                </>
            )}
            <br />
        </div>
    );
};

export default AdminUsers;
