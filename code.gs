function importDefectDojoReport() {
  // API details
  const apiUrl = "https://<your_defect_dojo_url>/api/v2/reports/<report_id>/";  // Replace with your API URL
  const apiToken = "Token <your_api_token>";  // Replace with your DefectDojo API token

  // Fetch the report data from the API
  const options = {
    method: "GET",
    headers: {
      Authorization: apiToken,
      "Content-Type": "application/json"
    }
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  const jsonData = JSON.parse(response.getContentText());

  // Get the active sheet in the spreadsheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("EngagementReport");  // Replace with your sheet name
  
  // Clear previous data if necessary
  sheet.clear();

  // Parse JSON data and insert it into the Google Sheet
  // Adjust this according to the structure of the JSON response
  const headers = ["Field 1", "Field 2", "Field 3"];  // Example headers (replace with actual field names)
  sheet.appendRow(headers);  // Adding headers to the sheet

  // Assuming jsonData contains an array of findings or results
  const reportData = jsonData.findings;  // Adjust to the actual key where data is stored
  reportData.forEach(function(finding) {
    // Example fields, adjust according to actual JSON structure
    const row = [
      finding.title,
      finding.severity,
      finding.description,
    ];
    sheet.appendRow(row);
  });

  Logger.log("Data import complete.");
}
