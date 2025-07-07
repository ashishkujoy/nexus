import { BrushIcon, Users } from "lucide-react";

import "./filters.css";

export type Filter = {
    name: string;
    colorCode?: string;
    notice?: boolean;
    undeliveredFeedback?: boolean;
}

type FilterProps = {
    filter: Filter;
    activeTab: string;
    setFilter: (filter: Filter) => void;
}

const SearchBar = (props: { value: string; setValue: (s: string) => void; }) => {
    return (
        <div className="form-group">
            <div className="select-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name"
                    value={props.value}
                    onChange={(e) => props.setValue(e.target.value)}
                />
                <Users className="icon-right" />
            </div>
        </div>
    )
}

const ColorSelector = (props: { value?: string; setValue: (s: string) => void; }) => {
    return (
        <div className="form-group">
            <div className="select-container">
                <select
                    className="search-input"
                    value={props.value}
                    onChange={(e) => props.setValue(e.target.value)}
                >
                    <option value="">All Colors</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                    <option value="orange">Orange</option>
                </select>

                <BrushIcon className="icon-right" />
            </div>
        </div>
    )
}

const FilterSection = (props: FilterProps) => {
    return (
        <div className="filter-section">
            <div className="filter-options">
                <SearchBar value={props.filter.name} setValue={(name) => props.setFilter({ ...props.filter, name })} />
                {["Feedbacks", "Interns"].includes(props.activeTab) && <ColorSelector
                    value={props.filter.colorCode}
                    setValue={(colorCode) => props.setFilter({ ...props.filter, colorCode })}
                />}

            </div>
        </div>
    )
}

export default FilterSection;