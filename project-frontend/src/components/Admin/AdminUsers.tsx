import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { User } from '../../types/types';

import { pageWidth } from '../../constants';
import { contentToText } from '../../types/languageFunctions';
import userService from '../../services/userService';
import { userStatus } from '../../util/misc';

interface Props {
    config: Config;
    user: User;
}
const AdminUserRow = ({ config, user }: Props) => {
    return (
        <tr>
            <td>{user.contactFirstName + ' ' + user.contactLastName}&emsp;</td>
            <td>{user.username}&emsp;</td>
            <td>{user.contactCountry}&emsp;</td>
            <td>{user.id}&emsp;</td>
            <td>{userStatus(user, config)}&emsp;</td>
            <td className='alignRight'>
                <button type='button'>{contentToText(ContentID.buttonShowInfo, config)}</button>
            </td>
        </tr>
    );
};

const AdminUsers = () => {
    const config = useSelector((state: RootState) => state.config);

    const [fetched, setFetched] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<'name' | 'username' | 'country' | 'id' | 'status'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [users, setUsers] = useState<User[]>([]);

    const sortArrow = (column: 'name' | 'username' | 'country' | 'id' | 'status') => {
        return <span className={column === sortBy ? '' : 'colorTransparent'}>&nbsp;{sortDirection === 'asc' ? '▲' : '▼'}</span>;
    };

    const setSorting = (by: 'name' | 'username' | 'country' | 'id' | 'status') => {
        if (sortBy !== by) {
            setSortBy(by);
        } else {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
    };

    const sortAndSet = (allUsers: User[]) => {
        switch (sortBy) {
            case 'country':
                if (sortDirection === 'asc') {
                    setUsers([...allUsers].sort((a, b) => a.contactCountry.localeCompare(b.contactCountry)));
                } else {
                    setUsers([...allUsers].sort((a, b) => b.contactCountry.localeCompare(a.contactCountry)));
                }
                break;
            case 'id':
                if (sortDirection === 'asc') {
                    setUsers([...allUsers].sort((a, b) => a.id - b.id));
                } else {
                    setUsers([...allUsers].sort((a, b) => b.id - a.id));
                }
                break;
            case 'name':
                if (sortDirection === 'asc') {
                    setUsers([...allUsers].sort((a, b) => a.contactLastName.localeCompare(b.contactLastName)));
                } else {
                    setUsers([...allUsers].sort((a, b) => b.contactLastName.localeCompare(a.contactLastName)));
                }
                break;
            case 'status':
                if (sortDirection === 'asc') {
                    setUsers([...allUsers].sort((a, b) => userStatus(a, config).localeCompare(userStatus(b, config))));
                } else {
                    setUsers([...allUsers].sort((a, b) => userStatus(b, config).localeCompare(userStatus(a, config))));
                }
                break;
            case 'username':
                if (sortDirection === 'asc') {
                    setUsers([...allUsers].sort((a, b) => a.username.localeCompare(b.username)));
                } else {
                    setUsers([...allUsers].sort((a, b) => b.username.localeCompare(a.username)));
                }
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
            sortAndSet(allUsers);
        };
        fetch();
    }, []);

    useEffect(() => {
        sortAndSet(users);
    }, [sortBy, sortDirection]);

    if (users.length < 1) {
        return <div className='semiBold sizeLarge'>{fetched ? 'No users' : 'Loading...'}</div>;
    }

    return (
        <>
            <table width={pageWidth} className='headerRow striped'>
                <tbody>
                    <tr>
                        <td onClick={() => setSorting('name')}>
                            <span className='clickable'>{contentToText(ContentID.miscName, config)}</span> {sortArrow('name')}
                        </td>
                        <td onClick={() => setSorting('username')}>
                            <span className='clickable'>{contentToText(ContentID.loginUsername, config)}</span> {sortArrow('username')}
                        </td>
                        <td onClick={() => setSorting('country')}>
                            <span className='clickable'>{contentToText(ContentID.checkOutCountry, config)}</span> {sortArrow('country')}
                        </td>
                        <td onClick={() => setSorting('id')}>
                            <span className='clickable'>{contentToText(ContentID.accountUserId, config)}</span> {sortArrow('id')}
                        </td>
                        <td onClick={() => setSorting('status')}>
                            <span className='clickable'>Status</span> {sortArrow('status')}
                        </td>
                        <td></td>
                    </tr>
                    {users.map((user) => (
                        <AdminUserRow key={user.id} config={config} user={user} />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default AdminUsers;
