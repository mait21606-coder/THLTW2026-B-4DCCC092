const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onUpdateStatus, onEdit, onDelete }) => {
  
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    
    if (destination.droppableId !== source.droppableId) {
      onUpdateStatus(draggableId, destination.droppableId as Status);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        overflowX: 'auto', 
        padding: '12px',
        minHeight: 'calc(100vh - 200px)' 
      }}>
        {columnsList.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          
          return (
            <div key={column.id} style={{ 
              flex: 1, 
              minWidth: '320px', 
              background: '#f5f5f5', 
              borderRadius: '12px', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <h3 style={{ padding: '16px', margin: 0, fontWeight: 600 }}>
                {column.title} 
                <Tag style={{ marginLeft: 8, borderRadius: '10px' }}>{columnTasks.length}</Tag>
              </h3>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ 
                      padding: '8px', 
                      flexGrow: 1, 
                      transition: 'background 0.3s',
                      background: snapshot.isDraggingOver ? '#ededed' : 'transparent' 
                    }}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ 
                              marginBottom: '12px', 
                              ...provided.draggableProps.style 
                            }}
                          >
                            <Card
                              hoverable
                              size="small"
                              style={{ 
                                borderRadius: '8px',
                                boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                              }}
                              actions={[
                                <EditOutlined key="edit" onClick={() => onEdit(task)} />,
                                <Popconfirm 
                                  title="Xóa công việc này?" 
                                  onConfirm={() => onDelete(task.id)}
                                  okText="Xóa"
                                  cancelText="Hủy"
                                >
                                  <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} />
                                </Popconfirm>
                              ]}
                            >
                              {/* Nội dung Task giữ nguyên hoặc tùy chỉnh thêm */}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};