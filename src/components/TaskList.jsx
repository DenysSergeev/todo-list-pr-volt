import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { useTypedSelector } from '../store/store.js';

import 'react-datepicker/dist/react-datepicker.css';

const TaskList = ({ editTask, deleteTask }) => {
  const { list } = useTypedSelector(state => state.tasks);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState({
    id: null,
    title: '',
    status: 'completed',
    date: new Date(),
  });
  const [filterType, setFilterType] = useState('all');

  const completedTasksCount = list.filter(
    task => task.status === 'completed'
  ).length;
  const uncompletedTasksCount = list.filter(
    task => task.status === 'not completed'
  ).length;

  useEffect(() => {
    setEditedTask({
      id: null,
      title: '',
      status: filterType === 'completed' ? 'completed' : 'not completed',
      date: new Date(),
    });
  }, [filterType]);

  const filteredList = list.filter(task => {
    if (filterType === 'all') return true;
    return filterType === 'completed'
      ? task.status === 'completed'
      : task.status === 'not completed';
  });

  const handleEdit = task => {
    setEditedTask({ ...task, date: new Date(task.date) });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    const editedTaskWithDateString = {
      ...editedTask,
      date: editedTask.date.toISOString(),
    };

    await editTask(editedTaskWithDateString);
    setShowEditModal(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Task List</h2>

      <div style={{ marginBottom: '10px' }}>
        <Button
          variant='outline-primary'
          style={{ marginRight: '10px' }}
          onClick={() => setFilterType('all')}
        >
          All
        </Button>
        <Button
          variant='outline-primary'
          style={{ marginRight: '10px' }}
          onClick={() => setFilterType('completed')}
        >
          Completed
        </Button>
        <Button
          variant='outline-primary'
          onClick={() => setFilterType('not complited')}
        >
          Current
        </Button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        Completed Tasks: {completedTasksCount}
      </div>

      <div style={{ marginBottom: '20px' }}>
        Uncompleted Tasks: {uncompletedTasksCount}
      </div>

      <ListGroup style={{ maxWidth: '600px', margin: '0 auto' }}>
        {filteredList.map(task => (
          <ListGroup.Item
            key={task.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              margin: '5px 0',
              background: '#f8f9fa',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ flex: '1' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {task.title}
              </div>

              <div>Status: {task.status}</div>

              <div>
                Date:{' '}
                {new Date(task.date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>

            <div>
              <Button
                variant='secondary'
                style={{ marginRight: '10px' }}
                onClick={() => handleEdit(task)}
              >
                Edit
              </Button>

              <Button variant='danger' onClick={() => deleteTask(task.id)}>
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group
              controlId='formEditTitle'
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '10px',
              }}
            >
              <Form.Label>Title</Form.Label>

              <Form.Control
                type='text'
                value={editedTask.title}
                onChange={e =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group
              controlId='formEditStatus'
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '10px',
              }}
            >
              <Form.Label>Status</Form.Label>

              <Form.Control
                as='select'
                value={editedTask.status}
                onChange={e =>
                  setEditedTask({ ...editedTask, status: e.target.value })
                }
              >
                <option value='completed'>Completed</option>
                <option value='not completed'>Not Completed</option>
              </Form.Control>
            </Form.Group>

            <Form.Group
              controlId='formEditDate'
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '10px',
              }}
            >
              <Form.Label>Date</Form.Label>

              <DatePicker
                selected={editedTask.date}
                onChange={newDate =>
                  setEditedTask({ ...editedTask, date: newDate })
                }
                dateFormat='dd MMM yyyy'
                className='form-control'
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowEditModal(false)}>
            Close
          </Button>

          <Button variant='primary' onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskList;
