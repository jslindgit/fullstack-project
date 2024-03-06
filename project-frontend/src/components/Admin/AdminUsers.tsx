import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { User } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';
import useField from '../../hooks/useField';
import { getUserStatus } from '../../util/userProvider';
import userService from '../../services/userService';

import { Link } from '../CustomLink';
import InputField from '../InputField';
import SortArrow from '../SortArrow';

interface Props {
    config: Config;
    user: User;
}
const AdminUserRow = ({ config, user }: Props) => {
    return (
        <tr className='buttonHighlight'>
            <td>{user.contactFirstName + ' ' + user.contactLastName}&emsp;</td>
            <td>{user.username}&emsp;</td>
            <td>{user.id}&emsp;</td>
            <td className='widthByContent'>{getUserStatus(user, config)}&emsp;</td>
            <td className='alignRight'>
                <Link to={'/admin/users/' + user.id}>
                    <button type='button'>{contentToText(ContentID.buttonShowInfo, config)}</button>
                </Link>
            </td>
        </tr>
    );
};

const AdminUsers = () => {
    type sortByOption = 'name' | 'username' | 'id' | 'status';

    const config = useSelector((state: RootState) => state.config);

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
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

    // Fetch all Users from backend:
    useEffect(() => {
        if (!fetched) {
            const fetch = async () => {
                setAllUsers(await userService.getAll());
                setFetched(true);
            };
            fetch();
        }
    }, [fetched]);

    // Filter Users according to search field value:
    useEffect(() => {
        setFilteredUsers(
            // prettier-ignore
            search.value.toString().trim().length > 0
                ?
                allUsers.filter(
                    (user) =>
                        user.contactFirstName.toLowerCase().includes(search.value.toString().trim().toLowerCase()) ||
                        user.contactLastName.toLowerCase().includes(search.value.toString().trim().toLowerCase()) ||
                        user.username.toLowerCase().includes(search.value.toString().trim().toLowerCase())
                )
                : allUsers
        );
    }, [allUsers, search.value]);

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

    if (allUsers.length < 1) {
        return <div className='semiBold sizeLarge'>{fetched ? 'No users' : 'Loading...'}</div>;
    }

    const columnHeader = (label: ContentID, sortByOption: sortByOption, widthByContent: boolean = false) => (
        <td className={widthByContent ? 'widthByContent' : ''} onClick={() => setSorting(sortByOption)}>
            <span
                className='clickable'
                title={contentToText(sortBy === sortByOption ? ContentID.miscClickToChangeSortingOrder : ContentID.miscClickToSortByThis, config)}
            >
                {contentToText(label, config)}
            </span>{' '}
            <SortArrow column={sortByOption} sortBy={sortBy} sortDirection={sortDirection} setSortDirection={setSortDirection} config={config} />
        </td>
    );

    return (
        <div className='grid-container pageWidth' data-gap='2rem'>
            <div className='grid-container searchBox' data-gap='2rem' style={{ gridTemplateColumns: 'auto auto 1fr' }}>
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
            <table width='100%' className='headerRow striped'>
                <tbody>
                    <tr>
                        {columnHeader(ContentID.miscName, 'name')}
                        {columnHeader(ContentID.loginUsername, 'username')}
                        {columnHeader(ContentID.accountUserId, 'id', true)}
                        {columnHeader(ContentID.userStatusHeader, 'status', true)}
                        <td></td>
                    </tr>
                    {sortedUsers.map((user) => (
                        <AdminUserRow key={user.id} config={config} user={user} />
                    ))}
                </tbody>
            </table>
            <br />
        </div>
    );
};

export default AdminUsers;
