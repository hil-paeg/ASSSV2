import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TicketBoard = () => {
  const tickets = {
    'Raised': [
      { id: '1', title: 'Update header logo to svg', issue: 'SVG_IMAGE_MIGRATION', assignee: 'Client1', issueId: 'BG-5' },
      { id: '2', title: 'Handle splitting URLs before postback', issue: 'AUTOFIX M1', assignee: 'Client2', issueId: 'BG-7' },
      { id: '7', title: 'Handle splitting URLs before postback', issue: 'AUTOFIX M1', assignee: 'Client2', issueId: 'BG-8' },
      { id: '8', title: 'Handle splitting URLs before postback', issue: 'AUTOFIX M1', assignee: 'Client2', issueId: 'BG-9' },
    ],
    'Confirmed by OEM': [
      { id: '3', title: 'Adjust SLO & DF report performance', issue: 'OPERATIONS', assignee: 'Admin1', issueId: 'BG-10' },
      { id: '4', title: 'CLI Schema for Autofix AOC', issue: 'AUTOFIX M1', assignee: 'Admin2', issueId: 'BG-16' },
      { id: '9', title: 'Adjust SLO & DF report performance', issue: 'OPERATIONS', assignee: 'Admin1', issueId: 'BG-12' },
    ],
    'Resolved': [
      { id: '5', title: '[UI] "Run Autofix" button', issue: 'AUTOFIX M1', assignee: 'Admin3', issueId: 'BG-67' },
      { id: '6', title: '[UI] "Run Autofix" button', issue: 'AUTOFIX M1', assignee: 'Admin3', issueId: 'BG-68' },
    ],
  };

  const onDragEnd = (result) => {
    console.log(result); // Implement drag state update and sync to backend here
  };

 const getColumnColor = (status) => {
  switch (status) {
    case 'Raised':
      return 'bg-yellow-50 border-yellow-300 text-yellow-800';
    case 'Confirmed by OEM':
      return 'bg-blue-400 border-indigo-400 text-indigo-900';
    case 'Resolved':
      return 'bg-green-100 border-green-400 text-green-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700';
  }
};


  return (
    <div className="p-6 bg-gradient-to-b from-white via-blue-50 to-white ">
      <h2 className="text-3xl font-bold text-blue-900 mb-8">Ticket Tracking Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(tickets).map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-lg shadow-md p-4 min-h-[400px] border ${getColumnColor(status)} transition-all`}
                >
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 capitalize flex justify-between items-center">
                    {status} {tickets[status].length > 0 && (
                      <span className="text-sm text-blue-600">{tickets[status].length}</span>
                    )}
                  </h3>

                  <div className="space-y-4">
                    {tickets[status].map((ticket, index) => (
                      <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white border border-blue-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-move"
                          >
                            <div>
                              <h4 className="text-sm font-medium text-blue-900">{ticket.title}</h4>
                              <p className="text-xs text-blue-600 mt-1">{ticket.issue}</p>
                            </div>
                            <div className="mt-2 flex justify-between items-center text-xs text-blue-500">
                              <span>#{ticket.issueId}</span>
                              <span>Assignee: {ticket.assignee}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>

                  {provided.placeholder}

                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TicketBoard;
