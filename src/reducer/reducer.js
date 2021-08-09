import { orderDetails } from '../data';
import { DataManager, Query } from '@syncfusion/ej2-data';
import {
    Grid_Paging, Grid_Sorting, Grid_Filtering,
    Grid_Add, Grid_Editing, Grid_Delete
} from './action';

// initially the Grid dataStateChange event is not triggered. here we set default pageSize as take . 
//you can set pageSize based on your application. 
const initialPage = { skip: 0, take: 12 } 
const initialState = {
    data: orderDetails,
    error: false,
    result: [],
    count: 0,
    isUpdated: false
}

const reducer = (state = initialState, action, gquery) => {
    const dataSource = [...initialState.data];
    let filter = [];
    const gData = new DataManager(dataSource);
    if (action.gQuery !== undefined) {
        filter = action.gQuery.queries.filter((fn, i) => {
            return fn.fn == "onWhere"
        })
    }

    // we executing the Grid action and CRUD peformering by using DataManager.. 
    //you can execute query based on your server
    switch (action.type) {
        case Grid_Paging: {

            // here we have execute the Grid query by using 'DataManager'
            const cData = gData.executeLocal(new Query());
            // execute Grid query except pagination... you can add the based on your db syntax
            const gridData = action.gQuery !== undefined ? new DataManager(cData).executeLocal(action.gQuery) : cData;
            // execute Grid page query... you can add the based on your db syntax
            const currentPageData = new DataManager(gridData).executeLocal(new Query().skip(action.payload.skip).take(action.payload.take));
           
            // we need to return the Grid data as result and count with object type
            return ({

                data: { result: currentPageData, count: filter.length ? gridData.length : cData.length }, isUpdated: false
            })
        }
        case Grid_Filtering: {
            // here we have execute the Grid query by using 'DataManager'
            const flData = gData.executeLocal(action.gQuery);
             // execute Grid page query... you can add the based on your db syntax
            const currentPageData = new DataManager(flData).executeLocal(new Query().skip(action.payload.skip).take(action.payload.take))
            return ({
                data: { result: currentPageData, count: flData.length }, isUpdated: false
            })
        }
        case Grid_Sorting: {
            // execute Grid sort query... you can add the based on your db syntax
            const sortData = gData.executeLocal(action.gQuery);
            // execute Grid page query... you can add the based on your db syntax
            const currentPageData = new DataManager(sortData).executeLocal(new Query().skip(action.payload.skip).take(action.payload.take));
            // we need to return the Grid data as result and count with object type
            return ({
                data: { result: currentPageData, count: sortData.length }, isUpdated: false
            })
        }
        case Grid_Add: {
            // here performing insert action by using 'DataManager'
            gData.insert(action.payload.data, '', null, 0);
            const addedData = gData.executeLocal(new Query());
            // update the original state
            initialState.data = [...addedData];
            const count = addedData.length;
            const gridData = new DataManager(addedData).executeLocal(action.gQuery);
            // execute Grid page query... you can add the based on your db syntax
            const currentPageData = new DataManager(gridData).executeLocal(new Query().skip(action.payload.state.skip).take(action.payload.state.take));
            // we need to return the Grid data as result and count with object type
            return ({
                data: { result: currentPageData, count: filter.length ? gridData.length : count }, isUpdated: true,
            })
        }
        case Grid_Editing: {
            // here performing insert action by using 'DataManager'
            gData.update('OrderID', action.payload.data);
            const updatedData = gData.executeLocal(new Query());
            initialState.data = [...updatedData];
            const count = updatedData.length;
            const gridData = new DataManager(updatedData).executeLocal(action.gQuery);
            // execute Grid page query... you can add the based on your db syntax
            const currentPageData = new DataManager(gridData).executeLocal(new Query().skip(action.payload.state.skip).take(action.payload.state.take));
           
           // we need to return the Grid data as result and count with object type
            return ({
                data: { result: currentPageData, count: filter.length ? gridData.length : count }, isUpdated: true,
            })
        }
        case Grid_Delete: {
            // here performing insert action by using 'DataManager'
            gData.remove('OrderID', { OrderID: action.payload.data[0]['OrderID'] });
            const updatedData = gData.executeLocal(new Query());
            initialState.data = [...updatedData];
            const count = updatedData.length;
            const gridData = new DataManager(updatedData).executeLocal(action.gQuery);
             // execute Grid page query... you can add the based on your db syntax
            const currentPageData = new DataManager(gridData).executeLocal(new Query().skip(action.payload.state.skip).take(action.payload.state.take));
            // we need to return the Grid data as result and count with object type
            return ({
                data: { result: currentPageData, count: filter.length ? gridData.length : count }, isUpdated: true,
            })
        }
        default: {
            // we need to return the Grid data as result and count with object type
            const count1 = state.data.length;
            const data1 = { data: { result: state.data.slice(initialPage.skip, initialPage.take), count: count1 }, isUpdated: false }
            return data1;
        }
    }
}

export default reducer;
