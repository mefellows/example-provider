local function bearer_token()
  return os.date("!%Y-%m-%dT%H:%M:%SZ")
end

-- Extract operationId from Drift data block
-- Data structure: Integer(1)=description, Integer(2)=operationId, Integer(3)=test suite, Integer(4)=duration (optional)
local function extract_operation_id(data)
  if data and data[2] then
    return tostring(data[2])
  end
  return nil
end

local exports = {
  event_handlers = {
    ["operation:started"] = function(event, data)
      local operation_id = extract_operation_id(data)
      if operation_id then
        local res = http({
          url = "http://localhost:8080/test/setup/" .. operation_id, -- TODO: can this URL be parameterised in the drift.yaml / environment file?
          method = "POST",
          headers = {
            Authorization = "Bearer " .. bearer_token(),
            ["Content-Type"] = "application/json"
          },
          body = ""
        })
        if res.status ~= 200 then
          print("Setup failed: " .. dbg(res))
        end
      end
    end,
    
    ["operation:finished"] = function(event, data)
      -- Teardown state after the operation completes      
      local operation_id = extract_operation_id(data)

      if operation_id then
        local res = http({
          url = "http://localhost:8080/test/reset",
          method = "POST",
          headers = {
            Authorization = "Bearer " .. bearer_token(),
            ["Content-Type"] = "application/json"
          },
          body = ""
        })
        if res.status ~= 200 then
          print("Teardown failed: " .. dbg(res))
        end
      end
      
      -- TODO: make another version of this script which executes JS directly
      -- capture output from automation script and print it
      -- os.execute("node ./automation/index.js")
    end,
  },

  exported_functions = {
    bearer_token = bearer_token,
  }
}

return exports
