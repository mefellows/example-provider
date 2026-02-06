local function bearer_token()
  return os.date("!%Y-%m-%dT%H:%M:%SZ")
end

-- Extract operationId from Quilt data block
-- Data structure: Integer(1)=description, Integer(2)=operationId, Integer(3)=test suite, Integer(4)=duration (optional)
local function extract_operation_id(data)
  if data and data[2] then
    return tostring(data[2])
  end
  return nil
end

local STATE_SERVER_URL = os.getenv("STATE_SERVER_URL") or "http://localhost:9000"

local exports = {
  event_handlers = {
    ["operation:started"] = function(event, data)
      local operation_id = extract_operation_id(data)
      if operation_id then
        local res = http({
          url = STATE_SERVER_URL .. "/setup/" .. operation_id,
          method = "POST",
          headers = {
            ["Content-Type"] = "application/json"
          },
          body = ""
        })
        if res.status ~= 200 then
          print("Setup failed for operation: " .. operation_id .. " (status: " .. (res.status or "unknown") .. ")")
        end
      end
    end,
    
    ["operation:finished"] = function(event, data)
      local res = http({
        url = STATE_SERVER_URL .. "/reset",
        method = "POST",
        headers = {
          ["Content-Type"] = "application/json"
        },
        body = ""
      })
      if res.status ~= 200 then
        print("Teardown failed (status: " .. (res.status or "unknown") .. ")")
      end
    end,
  },

  exported_functions = {
    bearer_token = bearer_token,
  }
}

return exports
