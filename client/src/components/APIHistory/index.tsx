import React from "react";
import {getApiHistory, getApiList} from "../../service/history";
import {Button, Col, DatePicker, Dropdown, Form, Input, Menu, Pagination, Row, Select, Space, Table,} from "antd";
import "./style.css";
import {Link} from "react-router-dom";
import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";
import {getUser} from "../../service/user";
import moment from "moment";

const {Column} = Table;
const {Search} = Input;

const APIHistory = () => {
    // Lọc theo tên người gọi
    const [searchUser, setSearchUser] = React.useState<String>();
    const searchUserOnchange = (event) => {
        setSearchUser(event.target.value);
    };

    //Lọc theo tên ứng dụng
    const [searchClient, setSearchClient] = React.useState<String>();
    const searchClientOnchange = (event) => {
        setSearchClient(event.target.value);
    };
    //Lọc theo ngày tháng
    const [filterDateStart, setFilterDateStart] = React.useState<String>();
    const [filterDateEnd, setFilterDateEnd] = React.useState<String>();

    const filterDateChange = (dates, dateStrings) => {
        if (dates) {
            setFilterDateStart(dateStrings[0]);
            setFilterDateEnd(dateStrings[1]);
        } else {
            setFilterDateStart(null);
            setFilterDateEnd(null);
        }
    };

    //Lọc theo api
    const [api, setApi] = React.useState<{
        label: string;
        value: string;
    }[]>();

    async function getApi() {
        await getApiList().then((res) => {
            const option = [];
            res.data.data.result.clients.map((api) => {
                option.push({
                    label: api.name,
                    value: api._id,
                });
            });
            setApi(option)
        });
    }

    React.useEffect(() => {
        getApi();
    }, []);
    const [searchApi, setSearchApi] = React.useState<Array<String>>();
    const apiHandleChange = (value: Array<string>) => {
        setSearchApi(value);
    };
    //Lọc theo phản hồi khách hàng
    const [filterFeedback, setFilterFeedback] = React.useState<boolean>();

    const handleMenuClick = (e) => {
        if (e.key == "1") {
            setFilterFeedback(true);
        } else if (e.key == "0") {
            setFilterFeedback(false);
        } else {
            setFilterFeedback(null);
        }
    };

    const menu = (
        <Menu
            onClick={handleMenuClick}
            items={[
                {
                    label: "Có phản hồi",
                    key: "1",
                },
                {
                    label: "Không phản hồi",
                    key: "0",
                },
            ]}
        />
    );

    //Phân trang
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const onShowSizeChange = (current, pageSize) => {
        setPage(current);
        setPageSize(pageSize);
    };
    //Gọi api lấy dữ liệu
    const [form] = Form.useForm();
    const [history, setHistory] = React.useState(null);
    const [filter, setFilter] = React.useState(null);
    const [filterClick, setFilterClick] = React.useState(true);
    const [total, setTotal] = React.useState(null);

    const onSubmitFilter = () => {
        setFilter({
            startTime: filterDateStart,
            endTime: filterDateEnd,
            feedback: filterFeedback,
            user: searchUser,
            apiIds: searchApi,
            application: searchClient,
        });
        setPage(1);
        setFilterClick((prev) => !prev);
    };

    async function getHistory() {
        getApiHistory({
            page: page,
            pageSize: pageSize,
            isPaging: true,
            ...filter,
        }).then((res) => {
            const data = [];
            res.data.data.result.listApiHistory.map((res) => {
                data.push({key: res._id, ...res});
            });
            setTotal(res.data.data.pagination.total);
            setHistory(data);
        });
    }

    React.useEffect(() => {
        getHistory();
    }, [page, pageSize, filterClick]);

    return (
        <Row className='api-history' >
          <Col key={1} flex={2} style={{backgroundColor:"#f5f5f5"}}>
            <Sidebar activeItemId='api'/>
          </Col>
          <Col key={2} flex={8} style={{backgroundColor:"#f5f5f5"}}>
            <Header user={{userId: "001", userName: "admin", email: "test@gmail.com"}}/>
            <div style={{display: "flex"}}>
                <div>
                    <h1>Lịch sử gọi API</h1>
                    <Form onFinish={onSubmitFilter} form={form} className="filter-api">
                        <Row>
                            <Col>
                                <Form.Item className="form-item" name="user">
                                    <Input
                                        placeholder="Tìm kiếm theo người dùng"
                                        onChange={searchUserOnchange}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item className="form-item" name="application">
                                    <Input
                                        placeholder="Tìm kiếm theo ứng dụng"
                                        onChange={searchClientOnchange}
                                        allowClear
                                    />

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Item className="form-item" name="time">
                                    <DatePicker.RangePicker
                                        placeholder={["Bắt đầu", "Kết thúc"]}
                                        onChange={filterDateChange}
                                        format="YYYY-MM-DD"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col><Col>
                            <Form.Item className="form-item" name="apiIds">
                                <Select
                                    mode="multiple"
                                    style={{width: "100%"}}
                                    placeholder="Lọc theo API"
                                    defaultValue={[]}
                                    onChange={apiHandleChange}
                                    options={api}
                                />
                            </Form.Item>
                        </Col>
                        </Row>
                        <Form.Item className="form-item" name="feedback">
                            <Dropdown.Button overlay={menu}>Feedback</Dropdown.Button>
                        </Form.Item>

                        <Row justify="end">
                            <Col>
                                <Form.Item>
                                    <Button
                                        style={{
                                            marginLeft: '12px',
                                        }}
                                        onClick={() => {
                                            form.resetFields();
                                            setFilter({});
                                            getHistory().then();
                                        }}
                                        className="button"
                                    >
                                        Đặt lại
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="button">Tìm kiếm</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <Table dataSource={history} pagination={false}>
                        <Column title="Người gọi" dataIndex="user" key="user"/>
                        <Column
                            title="Ứng dụng"
                            dataIndex="application"
                            key="application"
                        />
                        <Column title="API" dataIndex="api" key="api"/>
                        <Column title="Quota" dataIndex="quota" key="quota"/>
                        <Column title="Trạng thái" dataIndex="status" key="status"/>
                        <Column title="Phương thức" dataIndex="method" key="method"/>
                        <Column
                            title="Thời gian gửi request"
                            dataIndex="createdAt"
                            key="createdAt"
                            render = {(text, record)=>(
                                <p>{moment(text).format('DD-MM-YYYY-HH:mm:SS')}</p>
                            )}
                        />

                        <Column
                            title="Thời gian trả response"
                            dataIndex="responseTime"
                            key="responseTime"

                        />
                        <Column
                            title="Phản hồi"
                            dataIndex="feedback"
                            key="feedback"
                        ></Column>
                        <Column
                            title="Action"
                            key="_id"
                            render={(key) => (
                                <Space size="middle">
                                    <Link to={`/history/${key._id}`}>Chi tiết</Link>
                                    {/* <Popconfirm
                    title="Bạn có muốn xóa lần gọi API này ?"
                    onConfirm={() => {}}
                    onCancel={() => {}}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <a>Xóa</a>
                  </Popconfirm> */}
                                </Space>
                            )}
                        />
                    </Table>
                    <Pagination
                        onChange={onShowSizeChange}
                        total={total}
                        showTotal={(total) => `Total ${total} items`}
                        defaultPageSize={10}
                        defaultCurrent={1}
                    />
                </div>
            </div>
          </Col>
        </Row>
    );
};

export default APIHistory;
