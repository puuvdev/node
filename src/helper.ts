const defaultAuthValue = "$res:f/models/mongo_resource";
type AggregationStage = { [key: string]: any }; // Simplified for demonstration purposes

type RequestBody = {
  skip: number;
  limit: number;
  pipeline: AggregationStage[];
  collectionName: string;
  auth?: string;
};
function createRequestBody(
  skip: number,
  limit: number,
  pipeline: AggregationStage[],
  collectionName: string,
  auth?: string
): RequestBody {
  return {
    skip,
    limit,
    pipeline,
    collectionName,
    auth: auth ?? defaultAuthValue,
  };
}
function log(data: { message: string; error: string }) {
  // ep
}
function waitForJobCompletion(UUID: string, token: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const endpoint = `https://workflow.posentegra.com/api/w/posentegra/jobs_u/completed/get_result_maybe/${UUID}`;
      const checkResponse = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const checkData = await checkResponse.json();

      if (checkData.completed) {
        resolve(checkData);
      } else {
        // If not completed, wait for a second then try again
        setTimeout(async () => {
          const result = await waitForJobCompletion(UUID, token);
          resolve(result);
        }, 1000);
      }
    } catch (error) {
      reject(error);
    }
  });
}
//ENsiIiAvOi5niJpg6l8iEJAWYAcj6o
export async function g_script(
  scriptName: string,
  token: string,
  body: RequestBody,
  isAsync?: boolean
) {
  let requestBody = createRequestBody(
    body.skip,
    body.limit,
    body.pipeline,
    body.collectionName
  );

  const jobTriggerResponse = await triggerJob(
    requestBody,
    scriptName,
    token,
    isAsync
  );
  if (isAsync === true) {
    const UUID = await jobTriggerResponse.text();
    const jobCompletionData = await waitForJobCompletion(UUID, token);
    return jobCompletionData;
  }
  const data = await jobTriggerResponse.json();
  return data;
}

const callScript = (name: string, async: boolean) => {
  let url = `https://workflow.posentegra.com/api/w/posentegra/jobs/${
    async === false ? "run_wait_result" : "run"
  }/p/${name}`;
  return url;
};

async function triggerJob(
  requestBody: RequestBody,
  scriptName: string,
  token: string,
  isAsync?: boolean
) {
  requestBody["auth"] = "$res:f/models/mongo_resource";
  const body = JSON.stringify(requestBody);
  const endpoint = callScript(scriptName, isAsync ? isAsync : false);

  return await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
}
