import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../styles/Schedule.css';

const Calendar = ({ events, onEventChange, onEventReceive, onEventClick, initialView = 'timeGridWeek' }) => {
    const renderEventContent = (eventInfo) => {
        const { event } = eventInfo;
        const type = event.extendedProps?.type;
        const isCompleted = event.extendedProps?.status === 'completed';

        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', opacity: isCompleted ? 0.5 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

                    {/* Checkbox for Study Sessions */}
                    {type === 'study_session' && (
                        <div
                            className="event-checkbox"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (eventInfo.view.calendar.getOption('eventClick')) {
                                    // This click is handled by the eventClick handler below via class check
                                }
                            }}
                            style={{
                                width: '14px',
                                height: '14px',
                                border: '1px solid #0B1120',
                                borderRadius: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isCompleted ? '#0B1120' : 'transparent',
                                flexShrink: 0
                            }}
                        >
                            {isCompleted && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
                        </div>
                    )}

                    <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {event.title}
                    </div>
                </div>

                {/* Room / Course Info */}
                {(event.extendedProps?.course || type === 'class') && (
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                        {event.extendedProps?.course}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={initialView}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                editable={true}
                droppable={true}
                selectable={true}
                slotMinTime="07:00:00"
                slotMaxTime="23:00:00"
                allDaySlot={true}
                nowIndicator={true}
                scrollTime="08:00:00"
                slotEventOverlap={false}
                height="100%"
                events={events}
                eventChange={onEventChange}
                eventReceive={onEventReceive}
                eventClick={(info) => {
                    // Check if click was on checkbox
                    if (info.jsEvent.target.closest('.event-checkbox')) {
                        // It was the checkbox, trigger completion logic instead of detail modal
                        if (onEventClick) {
                            onEventClick(info.event, true); // true = toggleComplete
                        }
                    } else {
                        onEventClick && onEventClick(info.event, false);
                    }
                }}
                select={(info) => {
                    // Trigger creation modal
                    if (onEventClick) {
                        // Pass a mock event object for the modal to hydrate
                        onEventClick({
                            id: 'new_' + Date.now(),
                            title: '',
                            start: info.startStr,
                            end: info.endStr,
                            allDay: info.allDay,
                            extendedProps: { type: 'study_session', course: '' }
                        }, false);
                    }
                }}
                eventContent={renderEventContent}
                eventClassNames={(arg) => {
                    return [arg.event.extendedProps.type ? `event-${arg.event.extendedProps.type}` : '']
                }}
            />
        </div>
    );
};

export default Calendar;
