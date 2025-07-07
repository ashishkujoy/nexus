import { AlertTriangle, BinocularsIcon, BrushIcon, Users } from "lucide-react";

import { ReactNode } from "react";
import "./filters.css";

export type Filter = {
    name: string;
    colorCode?: string;
    notice?: boolean;
    feedbacks: string;
    watchout?: boolean;
}

type FilterProps = {
    filter: Filter;
    activeTab: string;
    setFilter: (filter: Filter) => void;
}

type CheckboxFilterProps = {
    icon: ReactNode;
    title: string;
    value?: boolean;
    setValue: (s: boolean) => void;
}

const NoticeFilter = (props: CheckboxFilterProps) => {
    return (
        <div>
            <label className="checkbox-label">
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={props.value}
                        onChange={(e) => props.setValue(e.target.checked)}
                        className="sr-only"
                    />
                    <div className={`checkbox-box ${props.value ? 'checked' : 'unckecked'}`}>
                        {props.value && props.icon}
                    </div>
                </div>
                {props.title}
            </label>
        </div>
    )
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

const DeliveryStatusFilter = (props: { status: string; setStatus: (s: string) => void }) => {
    return (
        <div className="form-group">
            <div className="select-container">
                <select
                    className="search-input"
                    value={props.status}
                    onChange={(e) => props.setStatus(e.target.value)}
                >
                    <option value="All">Both Deliver/Undeliver</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Undelivered">Undelivered</option>
                </select>

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
                {
                    props.activeTab === "Feedbacks" && <DeliveryStatusFilter
                        status={props.filter.feedbacks}
                        setStatus={(feedbacks) => props.setFilter({ ...props.filter, feedbacks })}
                    />
                }
                {["Feedbacks", "Interns"].includes(props.activeTab) && <NoticeFilter
                    icon={<AlertTriangle className="text-white" />}
                    title="Notice"
                    value={props.filter.notice}
                    setValue={(notice) => props.setFilter({ ...props.filter, notice })}
                />}
                {
                    props.activeTab === "Observations" && <NoticeFilter
                        icon={<BinocularsIcon color="orange" enableBackground={"white"} />}
                        title="Watchout"
                        value={props.filter.watchout}
                        setValue={(watchout) => props.setFilter({ ...props.filter, watchout })}
                    />
                }
            </div>
        </div>
    )
}

export default FilterSection;