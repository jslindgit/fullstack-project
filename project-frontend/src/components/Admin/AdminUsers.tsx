import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { User } from '../../types/types';

import { pageWidth } from '../../constants';
import { contentToText } from '../../types/languageFunctions';
import useField from '../../hooks/useField';
import { getUserStatus } from '../../util/userProvider';
import userService from '../../services/userService';

import { Link } from '../CustomLink';
import InputField from '../InputField';
import SortArrow from '../SortArrow';

interface Props {
    config: Config;
    hoveredButton: User | null;
    setHoveredButton: React.Dispatch<React.SetStateAction<User | null>>;
    user: User;
}
const AdminUserRow = ({ config, user, hoveredButton, setHoveredButton }: Props) => {
    return (
        <tr className={'hoverableRow' + (hoveredButton === user ? ' hover' : '')}>
            <td>{user.contactFirstName + ' ' + user.contactLastName}&emsp;</td>
            <td>{user.username}&emsp;</td>
            <td>{user.id}&emsp;</td>
            <td className='widthByContent'>{getUserStatus(user, config)}&emsp;</td>
            <td className='alignRight'>
                <Link to={'/admin/users/' + user.id}>
                    <button type='button' onMouseLeave={() => setHoveredButton(null)} onMouseOver={() => setHoveredButton(user)}>
                        {contentToText(ContentID.buttonShowInfo, config)}
                    </button>
                </Link>
            </td>
        </tr>
    );
};

const AdminUsers = () => {
    type sortByOption = 'name' | 'username' | 'id' | 'status';

    const config = useSelector((state: RootState) => state.config);

    const [fetched, setFetched] = useState<boolean>(false);
    const [hoveredButton, setHoveredButton] = useState<User | null>(null);
    const [sortBy, setSortBy] = useState<sortByOption>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [users, setUsers] = useState<User[]>([]);

    const search = useField('text', ContentID.miscSearch);

    const setSorting = (by: sortByOption) => {
        if (sortBy !== by) {
            setSortBy(by);
        } else {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
    };

    const sortAndSet = (allUsers: User[]) => {
        switch (sortBy) {
            case 'id':
                setUsers([...allUsers].sort((a, b) => (sortDirection === 'asc' ? a.id - b.id : b.id - a.id)));
                break;
            case 'name':
                setUsers(
                    [...allUsers].sort((a, b) =>
                        sortDirection === 'asc' ? a.contactLastName.localeCompare(b.contactLastName) : b.contactLastName.localeCompare(a.contactLastName)
                    )
                );
                break;
            case 'status':
                setUsers(
                    [...allUsers].sort((a, b) =>
                        sortDirection === 'asc'
                            ? getUserStatus(a, config).localeCompare(getUserStatus(b, config))
                            : getUserStatus(b, config).localeCompare(getUserStatus(a, config))
                    )
                );
                break;
            case 'username':
                setUsers([...allUsers].sort((a, b) => (sortDirection === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username))));
                break;
            default:
                setUsers(allUsers);
                break;
        }
    };

    useEffect(() => {
        const fetch = async () => {
            const allUsers = await userService.getAll();
            setFetched(true);
            sortAndSet(
                allUsers.filter(
                    (user) =>
                        user.contactFirstName.toLowerCase().includes(search.stringValue().toLowerCase()) ||
                        user.contactLastName.toLowerCase().includes(search.stringValue().toLowerCase()) ||
                        user.username.toLowerCase().includes(search.stringValue().toLowerCase())
                )
            );
        };
        fetch();
    }, [search.value]);

    useEffect(() => {
        sortAndSet(users);
    }, [sortBy, sortDirection]);

    if (users.length < 1) {
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
        <>
            <table width='100%' className='bgColorGrayExtremelyLight' style={{ border: '2px solid var(--colorGray)', borderRadius: '0.5rem' }}>
                <tbody>
                    <tr>
                        <td className='semiBold widthByContent'>{contentToText(search.label, config)}:</td>
                        <td className='widthByContent'>
                            <InputField
                                useField={search}
                                width={'20rem'}
                                placeHolder={contentToText(ContentID.miscName, config) + ', ' + contentToText(ContentID.contactEmail, config)}
                            />
                        </td>
                        <td className='alignLeft'>
                            <button type='button' onClick={() => search.setNewValue('')}>
                                {contentToText(ContentID.buttonClear, config)}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <table width={pageWidth} className='headerRow striped'>
                <tbody>
                    <tr>
                        {columnHeader(ContentID.miscName, 'name')}
                        {columnHeader(ContentID.loginUsername, 'username')}
                        {columnHeader(ContentID.accountUserId, 'id', true)}
                        {columnHeader(ContentID.userStatusHeader, 'status', true)}
                        <td></td>
                    </tr>
                    {users.map((user) => (
                        <AdminUserRow key={user.id} config={config} user={user} hoveredButton={hoveredButton} setHoveredButton={setHoveredButton} />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default AdminUsers;
