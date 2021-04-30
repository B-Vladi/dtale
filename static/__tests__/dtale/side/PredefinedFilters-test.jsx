import { shallow } from "enzyme";
import React from "react";

import { expect, it } from "@jest/globals";

import serverState from "../../../dtale/serverStateManagement";
import FilterInput from "../../../dtale/side/predefined_filters/FilterInput";
import { ReactPanel as PredefinedFilters } from "../../../dtale/side/predefined_filters/Panel";
import * as fetcher from "../../../fetcher";
import reduxUtils from "../../redux-test-utils";

describe("PredefinedFilters panel", () => {
  let wrapper, props, fetchJsonSpy, updateSettingsSpy;

  beforeEach(() => {
    fetchJsonSpy = jest.spyOn(fetcher, "fetchJson");
    fetchJsonSpy.mockImplementation((_url, callback) => {
      callback({ ...reduxUtils.DTYPES, success: true });
    });
    updateSettingsSpy = jest.spyOn(serverState, "updateSettings");
    updateSettingsSpy.mockImplementation((_settings, _dataId, callback) => {
      callback();
    });
    props = {
      dataId: "1",
      filters: [
        {
          name: "custom_foo1",
          description: "custom_foo1 description",
          column: "col1",
          inputType: "input",
        },
        {
          name: "custom_foo2",
          description: "custom_foo2 description",
          column: "col1",
          inputType: "select",
        },
        {
          name: "custom_foo3",
          description: "custom_foo3 description",
          column: "col1",
          inputType: "multiselect",
        },
      ],
      filterValues: { custom_foo1: 1, custom_foo2: 1, custom_foo3: [1, 2] },
      hideSidePanel: jest.fn(),
      updateSettings: jest.fn(),
    };
    wrapper = shallow(<PredefinedFilters {...props} />);
  });

  afterEach(jest.resetAllMocks);

  afterAll(jest.restoreAllMocks);

  it("renders successfully", () => {
    expect(wrapper.find(FilterInput)).toHaveLength(3);
  });

  it("saves correctly", () => {
    wrapper.find(FilterInput).first().props().save("custom_foo1", 2);
    updateSettingsSpy.mock.calls[0][2]();
    expect(props.updateSettings).toHaveBeenCalledWith({
      predefinedFilters: { custom_foo1: 2, custom_foo2: 1, custom_foo3: [1, 2] },
    });
  });

  it("removes correctly", () => {
    wrapper.find(FilterInput).first().props().save("custom_foo1", undefined);
    updateSettingsSpy.mock.calls[0][2]();
    expect(props.updateSettings).toHaveBeenCalledWith({
      predefinedFilters: { custom_foo2: 1, custom_foo3: [1, 2] },
    });
  });

  it("clears all correctly", () => {
    wrapper.find("button").last().simulate("click");
    updateSettingsSpy.mock.calls[0][2]();
    expect(props.updateSettings).toHaveBeenCalledWith({
      predefinedFilters: {},
    });
  });

  it("closes the panel correctly", () => {
    wrapper.find("button").first().simulate("click");
    expect(props.hideSidePanel).toHaveBeenCalled();
  });
});
