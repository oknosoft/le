/**
 * ### Выбор варианта сохраненных настроек
 * страница формы справочника SchemeSettings
 *
 * Created 19.12.2016
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import CopyIcon from '@material-ui/icons/FileCopy';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DataField from '../DataField';
import withStyles from '../Header/toolbar';

class SchemeSettingsSelect extends Component {

  static propTypes = {
    scheme: PropTypes.object.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = $p.dp.scheme_settings.dp(props.scheme);
  }

  shouldComponentUpdate({scheme}, {_obj}) {
    if(scheme != _obj.scheme) {
      this.setState($p.dp.scheme_settings.dp(scheme), () => this.forceUpdate());
      return false;
    }
    return true;
  }

  handleSave = () => {
    const {scheme, handleSchemeChange} = this.props;
    scheme.save().then(() => {
      handleSchemeChange(scheme);
    });
  };

  handleCreate = () => {
    const {scheme, handleSchemeChange} = this.props;
    const proto = Object.assign({}, scheme._obj);
    proto.name = proto.name.replace(/[0-9]/g, '') + Math.floor(10 + Math.random() * 21);
    proto.ref = '';

    scheme._manager.create(proto).then((scheme) => {
      handleSchemeChange(scheme);
    });
  };

  render() {

    const {state, props, handleCreate, handleSave} = this;
    const {_obj, _meta} = state;
    const {scheme, classes, handleSchemeChange, frm_key, source_mode} = props;

    return [
      <Toolbar key="bar" disableGutters className={classes.toolbar}>
        <IconButton title="Сохранить вариант настроек" onClick={handleSave}><SaveIcon/></IconButton>
        <IconButton title="Создать копию настроек" onClick={handleCreate}><CopyIcon/></IconButton>
      </Toolbar>,

      <FormGroup key="body" style={{margin: 16}}>
        <DataField _obj={scheme} _fld="name" fullWidth/>
        {!source_mode && <FormControl className={classes.formControl} fullWidth>
          <InputLabel>Режим получения данных</InputLabel>
          <Select
            native
            //margin="dense"
            defaultValue={scheme.source_mode(frm_key, source_mode)}
            onChange={({target}) => scheme.source_mode(frm_key, target.value)}
          >
            <option value="ram">Индекс в ОЗУ</option>
            <option value="couchdb">Mango Couchdb</option>
            <option value="pg">Внешний индекс</option>
            <option value="custom">Метод формы списка</option>
          </Select>
        </FormControl>}
        {/*<DataField _obj={scheme} _fld="query" fullWidth/>*/}
        <DataField _obj={scheme} _fld="standard_period" fullWidth/>
      </FormGroup>
    ];

  }
};

export default withStyles(SchemeSettingsSelect);
