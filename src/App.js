import * as React from 'react';
import './App.css';
import { ColumnDirective, Edit, ColumnsDirective, Filter, GridComponent,Inject, Page, Sort, Toolbar } from '@syncfusion/ej2-react-grids';
import { connect } from 'react-redux';
import UpdateData from './selector';
import { Grid_Paging, Grid_Sorting, Grid_Filtering, Grid_Add, Grid_Editing, Grid_Delete } from './reducer/action'

class App extends React.Component {
  constructor() {
    super();
    this.gState = {};
  }
  pageSettings = { pageSize: 6 };
  validationRule = { required: true };
  orderidRules = { required: true, number: true };
  editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true };
  toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];

  dataStateChange(args) {
  // this event will be triggered when peforming any Grid action

    const query = this.gridInstance.getDataModule().generateQuery(true); // get the Grid query without pagination
    
    // dispatch  the page query
    if (args.action.requestType == "paging" || args.action.requestType == "refresh" || args.action.requestType == "delete") {
      this.props.dispatch({
        type: Grid_Paging,
        payload: args,
        gQuery: query

      })
    }
    // dispatch  the filtering query
     if (args.action.requestType == 'filtering') {
      this.props.dispatch({
        type: Grid_Filtering,
        payload: args,
        gQuery: query
      })
    }
    // dispatch  the sorting query
     if (args.action.requestType == 'sorting') {
      this.props.dispatch({
        type: Grid_Sorting,
        payload: args,
        gQuery: query
      })
    }
  }
  dataSourceChanged(state) {

    // this event will be triggered when we peform CRUD action
    
    this.gState = Object.assign(this.gState, state); // store the Grid aync process

    const query = this.gridInstance.getDataModule().generateQuery(true); // get the Grid query without pagination
    
    // dispatch the editing  action
    if (state.action == 'edit') {
      this.props.dispatch({
        type: Grid_Editing,
        payload: state,
        gQuery: query
      })
    }

    // dispatch the insert action
    else if (state.action == 'add') {
      this.props.dispatch({
        type: Grid_Add,
        payload: state,
        gQuery: query
      })
    }

    // dispatch the delete action
    else if (state.requestType == 'delete') {
      this.props.dispatch({
        type: Grid_Delete,
        payload: state,
        gQuery: query
      })
    }
    else {
      const query = this.gridInstance.getDataModule().generateQuery();
      this.props.dispatch({
        type: Grid_Paging,
        payload: state,
        gQuery: query
      })
    }
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    this.gridInstance.hideSpinner();
    if (this.props.data1.isUpdated) {
      this.gState.endEdit(); // To complete Grid CRUD - async process 
      this.gridInstance.freezeRefresh();
    }
  }

 
  render() {
    // render the EJ2 Grid component 
    return <GridComponent ref={grid => this.gridInstance = grid} dataSource={this.props.data1.currentData}  dataStateChange={this.dataStateChange.bind(this)} dataSourceChanged={this.dataSourceChanged.bind(this)} allowSorting={true} editSettings={this.editOptions} toolbar={this.toolbarOptions} allowFiltering={true} allowPaging={true}>
      <ColumnsDirective>
        <ColumnDirective field='OrderID' headerText='Order ID' width='140' textAlign='Right' validationRules={this.orderidRules} isPrimaryKey={true}></ColumnDirective>
        <ColumnDirective field='CustomerID' headerText='Customer Name' width='150' validationRules={this.validationRule}></ColumnDirective>
        <ColumnDirective field='Freight' headerText='Freight' width='140' format='C2' textAlign='Right' editType='numericedit' ></ColumnDirective>
        <ColumnDirective field='ShipCountry' headerText='Ship Country' width='150' ></ColumnDirective>
      </ColumnsDirective>
      <Inject services={[Page, Sort, Filter, Edit, Toolbar]} />
    </GridComponent>
  }
};
const mapStateToProps = (state, props) => {

  // UpdateData is a reselect selector
  return { data1: UpdateData(state) }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);






