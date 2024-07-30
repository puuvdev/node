interface Table {
  name: string;
  rows: Row[];
}

interface Row {
  cells: string[];
}

interface Data {
  tables: Table[];
}

interface Result {
  id: string;
  name: string;
}

const methodParamsMap: { [key: string]: string[] } = {
  test: [],
  paymentTypes: ["data"],
};

const asyncForeach = async (array: any, callback: any) => {
  for (const item of array) {
    await callback(item);
  }
};

class QueryFilter {
  async paymentTypes(data: any) {
    const result: Result[] = [];
    await asyncForeach(data.tables, async (table: Table) => {
      await asyncForeach(table.rows, async (row: Row) => {
        if (row.cells.length > 1) {
          result.push({
            id: row.cells[0],
            name: row.cells[1],
          });
        }
      });
    });

    return result;
  }
}

export default QueryFilter;
