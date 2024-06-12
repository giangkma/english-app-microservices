import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/icons/FeedbackOutlined';
import useStyle from './style';
import React, { useState } from 'react';
import FeedbackModal from './Feedback/Modal';

function Feedback() {
  const classes = useStyle();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <SpeedDial
        classes={{
          root: classes.root,
          fab: classes.fab,
          actions: classes.actions,
        }}
        onClick={handleOpen}
        hidden={false}
        ariaLabel="Speed Dial"
        icon={<SpeedDialIcon color="action" />}
        open={open}
        direction="up"></SpeedDial>
      <FeedbackModal onClose={() => setOpen(false)} open={open} />
    </>
  );
}

export default Feedback;
