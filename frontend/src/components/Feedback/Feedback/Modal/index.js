import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import React from 'react';
import useStyle from './style';
import InputCustom from 'components/UI/InputCustom';
import feedbackApi from 'apis/feedbackApi';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';

function FeedbackModal({ open, onClose }) {
  const classes = useStyle();
  const [value, setValue] = React.useState('');
  const dispatch = useDispatch();

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = async () => {
    try {
      if (!value) return;
      const res = await feedbackApi.createNew({ feedback: value });
      if (res.status === 200) {
        setValue('');
        onClose();
        dispatch(
          setMessage({
            type: 'success',
            message: 'Gửi ý kiến thành công',
          }),
        );
      }
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          message: error.message,
        }),
      );
    }
  };

  return (
    <Dialog
      classes={{
        paper: classes.rootPaper,
      }}
      onClose={onClose}
      aria-labelledby="setting dialog"
      disableBackdropClick={true}
      maxWidth="md"
      open={open}>
      <div className={`${classes.title} flex-center-between`}>
        <span>Góp ý với Amonino</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <InputCustom
          value={value}
          onChange={onChange}
          className="w-100"
          label="Ý kiến của bạn (*)"
        />
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button
          className="_btn _btn-default"
          onClick={onClose}
          color="default"
          size="small"
          variant="outlined">
          <p>Đóng</p>
        </Button>
        <Button
          className="_btn _btn-primary"
          color="primary"
          disabled={!value}
          onClick={onSubmit}
          size="small"
          variant="contained">
          Gửi ý kiến
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FeedbackModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

FeedbackModal.defaultProps = {
  onClose: function () {},
  open: false,
};

export default FeedbackModal;
