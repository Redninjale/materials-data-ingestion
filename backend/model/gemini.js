const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const alloy = require('../db/alloy');
const alloyReference = require('../db/alloyreference');
const reference = require('../db/reference');
const users = require('../db/users');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const graphSchema = {
  type: SchemaType.OBJECT,
  properties: {
    chartType: {
      type: SchemaType.STRING,
      description: "Specifies the chart type. Must match a chart type from react-google-charts such as LineChart, BarChart, AreaChart, PieChart, or ScatterChart.",
    },
    data: {
      type: SchemaType.ARRAY,
      description: "The data array for the chart. Each element represents a row in the chart.",
      items: {
        type: SchemaType.ARRAY,
        description: "An array representing a single row of data in the chart. The first element is typically the x-axis value, followed by y-axis values.",
        items: {
          type: SchemaType.STRING,
          description: "A value in the row. The first row can be strings but the rest of the rows must be a number. The type can vary depending on the chart type and data context.",
        },
      },
    },
    options: {
      type: SchemaType.OBJECT,
      description: "Required options for customizing the chart. Follows the options schema from react-google-charts.",
      properties: {
        title: {
          type: SchemaType.STRING,
          description: "The title of the chart.",
        },
        hAxis: {
          type: SchemaType.OBJECT,
          description: "Options for the horizontal axis.",
          properties: {
            title: {
              type: SchemaType.STRING,
              description: "Title for the horizontal axis.",
            },
          },
        },
        vAxis: {
          type: SchemaType.OBJECT,
          description: "Options for the vertical axis.",
          properties: {
            title: {
              type: SchemaType.STRING,
              description: "Title for the vertical axis.",
            },
          },
        },
      },
      required: ["title", "hAxis", "vAxis"]
    },
  },
  required: ["chartType", "data", "options"]
};

const tableSchema = {
  type: SchemaType.OBJECT,
  properties: {
    headers: {
      type: SchemaType.ARRAY,
      description: "An array of strings representing the table headers.",
      items: {
        type: SchemaType.STRING,
        description: "A single header for the table.",
      },
    },
    rows: {
      type: SchemaType.ARRAY,
      description: "An array of arrays, where each inner array represents a row in the table.",
      items: {
        type: SchemaType.ARRAY,
        description: "An array representing a single row in the table.",
        items: {
          type: SchemaType.STRING,
          description: "A value in the row. The type can vary depending on the table context.",
        },
      },
    },
    striped: {
      type: SchemaType.BOOLEAN,
      description: "Whether the table should have striped rows.",
    },
    bordered: {
      type: SchemaType.BOOLEAN,
      description: "Whether the table should have borders.",
    },
    hover: {
      type: SchemaType.BOOLEAN,
      description: "Whether the table rows should have hover effects.",
    },
    size: {
      type: SchemaType.STRING,
      description: "The size of the table. Can be 'sm' for small tables.",
    },
  },
  required: ["headers", "rows"]
}

const generalizedSchema = {
  description: "Generalized schema that can represent text, graph, or table data.",
  type: SchemaType.OBJECT,
  properties: {
    data_type: {
      type: SchemaType.STRING,
      description: `A string labeling the data-type. Must be 'text', 'graph', or 'table'.
      A string is labeled 'table' for any content related to tables. Schema for displaying tables using react-bootstrap. Supports table headers and rows.

      A string is labeled 'graph' for any content related to charts, graphs. Schema for displaying charts using react-google-charts. 
        Supported chart types include LineChart, BarChart, AreaChart, PieChart, and ScatterChart.

      A string is label 'text' for anything not related to 'graph' or 'table'. Used as a schema for displaying text content.
      `,
      oneOf: [
        { "enum" : "text"},
        { "enum" : "graph"},
        { "enum" : "table"},
      ]
    },
    title: {
        type: SchemaType.STRING,
        description: "The title of the any content.",
    },
    body: {
        type: SchemaType.STRING,
        description: "The main body of the any content. Give a description of the content. It can be 1-2 sentences describing on data analysis, depiction of the content, or the context around the content",
    },
    graph: {
      type: SchemaType.OBJECT,
      description: `Schema for graph content. Only include if data_type is 'graph'. Schema for displaying charts using react-google-charts. 
        Supported chart types include LineChart, BarChart, AreaChart, PieChart, and ScatterChart.`,
      ...graphSchema
    },
    table: {
      type: SchemaType.OBJECT,
      description: `Schema for table content. Only include if data_type is 'table'. 
      Schema for displaying tables using react-bootstrap. Supports table headers and rows.`,
      ...tableSchema
    },
    tags: {
      type: SchemaType.ARRAY,
      description: `An array of alloys associated with the content. These include 
        Steel,
        Aluminum Alloys,
        Brass,
        Bronze,
        Stainless Steel,
        Titanium Alloys,
        Nickel Alloys,
        Magnesium Alloys,
        Copper Alloys,
        Zinc Alloys,
        Lead Alloys,
        Tin Alloys,
        Aluminum_Silicon Alloys,
        Copper_Nickel Alloys,
        Nickel_Chromium Alloys,
        Cobalt_Chromium Alloys,
        Iron_Chromium_Nickel Alloys,
        Aluminum_Lithium Alloys,
        Titanium_Aluminum Alloys,
        Zirconium Alloys as well as all others from https://www.material-insights.org`,
      items: {
          type: SchemaType.OBJECT,
          description: "A single alloy tag.",
          properties: {
              name: {
                  type: SchemaType.STRING,
                  description: "The name of the alloy",
              },
              property: {
                  type: SchemaType.STRING,
                  description: "A summarized version of properties associated with the alloy",
              },
          },
          required: ["name"]
        },
      },
      links: {
          type: SchemaType.ARRAY,
          description: "An array of links associated with the content.",
          items: {
              type: SchemaType.OBJECT,
              description: "A single link object.",
              properties: {
                  url: {
                      type: SchemaType.STRING,
                      description: "The URL of the link.",
                  },
                  description: {
                      type: SchemaType.STRING,
                      description: "A description of the link.",
                  },
              },
              required: ["url"]
          },
      },
    },
  required: ["data_type", "title", "body"]
};

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", 
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: generalizedSchema,
    maxOutputTokens: 2048,
} });


const chat = model.startChat({
    history: [
    {
        role: "user",
        parts: [{ text: `During out chat, you must abide by a few rules. If the user asks for a chart, then you will
             send the data in a json that react-google charts can use` }],
        },
        {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
});

async function sendModel(req, res) {
    console.log("Working", req.body.data);
    let prompt = req.body.data
    try {
        const result = await chat.sendMessage(
        `
            Important: for all outputs, Only use data that is cross-referenced with research papers, government websites, organization websites, 
                journal websites, and educational websites.
            When prompted with an alloy, metal, and any materials ensure that you are providing tags with names and properties
            Important: Only return a single piece of valid JSON text.

            Here is the prompt:
        ` + prompt);
        
        console.log(JSON.parse(result.response.text()));
        const parsed_resp = JSON.parse(result.response.text());
        const stringify = JSON.stringify(result.response.text());

        user = await users.getFirstUser();
        ref = await reference.createReference(prompt, stringify, user.id);
        // console.log("INSERTED TO REFERENCE, Added ", ref);
        
        if (parsed_resp.tags) {
            parsed_resp.tags.map(async (tag) => {
                let result = await alloy.searchAlloysByName(tag.name.toLowerCase());
                // console.log(result);
                if (result.length === 0) {
                  result = await alloy.insertAlloy(tag.name.toLowerCase());
                  console.log("INSERTED TO ALLOY, Added ", result);
                }

                alloy_ref = await alloyReference.createAlloyReference(result[0].id, ref[0].id, tag.property);
                console.log("INSERTED TO ALLOY_REFERENCE, Added ", alloy_ref);
            });
        }

        res.send(stringify);
    } catch (error) {
      console.log(error);
      res.send(error)
    }   
}

module.exports = { sendModel }