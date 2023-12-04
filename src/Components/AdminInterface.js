import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Pagination from 'react-bootstrap/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Input,
  Checkbox,
  Button,
  IconButton,
  TextField,
  // TablePagination
} from '@mui/material';



const AdminInterface = () => {

  const [data, setData] = useState([]);



  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  // const [users, setUsers] = useState([]);
  console.log(pageCount);

  const fetchUsers = async () => {
    // Fetch users from your API endpoint
    const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    const data = await response.json();
    console.log(data);
    setData(data);
    return data;
  };
  const { data: users = [], refetch } = useQuery('users', fetchUsers);

  const handleSearch = () => {
    refetch();
    // setPage(0);
  };
  //handleNext
  const handleNext = () => {
    if (page === pageCount) return page;
    setPage(page + 1)
  };
  //handlePrevious
  const handlePrevious = () => {
    if (page === 1) return page;
    setPage(page - 1)

  }
  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const handleEdit = (rowId) => {
    setEditingRow(rowId);
  };

  const handleSave = () => {
    // Implement save functionality (in memory)
    setEditingRow(null);
  };

  // const handleDelete = (rowId) => {
  //   // Implement delete functionality (in memory)
  //   setSelectedRows((prevSelectedRows) =>
  //     prevSelectedRows.filter((id) => id !== rowId)
  //   );

  //   // If you want to remove the row from the displayed data (pageData), update the state accordingly
  //   setPageData((prevPageData) =>
  //     prevPageData.filter((user) => user.id !== rowId)
  //   );
  //   console.log("Item Deleted");
  //   // If you want to remove the row from the entire dataset (data), update the state accordingly
  //   setData((prevData) => prevData.filter((user) => user.id !== rowId));
  // };

  const deleteUser = (selectedUser) => {
    let userAfterDeletion = pageData.filter((user) => {
      return user.id !== selectedUser;
    });
    setPageData(userAfterDeletion);
  };


  const handleToggleSelectAll = () => {
    // Implement select/deselect all functionality (in memory)
    const allUserIds = users.map((user) => user.id);
    const allSelected = selectedRows.length === allUserIds.length;

    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allUserIds);
    }
  };

  const handleToggleSelect = (rowId) => {
    // Implement toggle select functionality (in memory)
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(rowId)) {
        return prevSelectedRows.filter((id) => id !== rowId);
      } else {
        return [...prevSelectedRows, rowId];
      }
    });
  };

  const handleDeleteSelected = () => {
    // Implement delete selected functionality (in memory)
    setSelectedRows([]);
  };
  useEffect(() => {
    fetchUsers();

  }, [page]);


  useEffect(() => {
    const pagedatacount = Math.ceil(data.length / 10);
    setPageCount(pagedatacount);

    if (page) {
      const LIMIT = 10;
      const skip = LIMIT * page // 5 *2 = 10
      const dataskip = data.slice(page === 1 ? 0 : skip - LIMIT, skip);
      setPageData(dataskip)
    }
  }, [data])

  return (
    <div>
      <div>
        <Input
          type="text"
          placeholder="EnterValue..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton className="search-icon" onClick={handleSearch}>
          Search
        </IconButton>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  onChange={handleToggleSelectAll}
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length < users.length
                  }
                  checked={selectedRows.length === users.length}
                />
              </TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              {/* Add other column headers here */}
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.length > 0 ? pageData
              .filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <TableRow key={user.id} className={editingRow === user.id ? 'editing-row' : ''}>
                  <TableCell>
                    <Checkbox
                      onChange={() => handleToggleSelect(user.id)}
                      checked={selectedRows.includes(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {editingRow === user.id ? (
                      <TextField
                        value={user.name}
                        onChange={(e) => {/* Implement edit functionality (in memory) */ }}
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  {/* Add other columns as needed */}
                  <TableCell>
                    {editingRow === user.id ? (
                      <Button className="action-btn" onClick={handleSave}>
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => handleEdit(user.id)}
                        >

                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<DeleteIcon />}
                          onClick={() => deleteUser(user.id)}
                        >

                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )) : <div className='d-flex justify-content-center mt-4'>
              Loading... <Spinner animation="border" variant='danger' />
            </div>}
          </TableBody>
        </Table>
      </TableContainer>
      <div className='d-flex justify-content-end'>
        <Pagination>
          <Pagination.First />
          <Pagination.Prev onClick={handlePrevious} disabled={page === 1} />
          <Pagination.Item>{1}</Pagination.Item>


          <Pagination.Item>{2}</Pagination.Item>

          <Pagination.Item active>{3}</Pagination.Item>
          <Pagination.Item>{4}</Pagination.Item>
          <Pagination.Item >{5}</Pagination.Item>



          <Pagination.Next onClick={handleNext} disabled={page === pageCount} />
          <Pagination.Last />
        </Pagination>
      </div>

      <div>
        <Button className="action-btn" color="secondary" onClick={handleDeleteSelected}>
          Delete Selected
        </Button>
      </div>
    </div>
  );
};

export default AdminInterface;
