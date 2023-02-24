import React from "react";
import {Link, useParams} from "react-router-dom";
import {getHistoryDetail} from "../../service/history";
import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";
import useCollapse from "react-collapsed";
import "./style.css";
import {Col, Row} from "antd";
import moment from "moment";

const APIHistoryDetail = () => {
    const param: any = useParams();
    const [detail, setDetail] = React.useState<{
        api?: string;
        apiId?: string;
        appId?: string;
        application?: string;
        createdAt?: string;
        feedback?: string;
        message?: string;
        method?: string;
        request?: {
            file?: string;
        };
        response?: {};
        responseTime?: number;
        status?: number;
        user?: string;
        _id: string;
    }>({_id: param.historyId});

    const [img, setImg] = React.useState();

    async function getApiHistory() {
        await getHistoryDetail(param.historyId).then((res) => {
            setDetail({...res.data.data.result});
            setImg(res.data.data.result.request.file);
        });
    }

    React.useEffect(() => {
        getApiHistory();
    }, []);
    React.useEffect(() => {
    }, []);

    const [isExpanded, setExpanded] = React.useState(false);

    const {getCollapseProps, getToggleProps} = useCollapse({isExpanded});

    return (
        <Row className="api-history-detail">
            <Col key={1} flex={2} style={{backgroundColor: "#f5f5f5"}}>
                <Sidebar activeItemId='api'/>
            </Col>
            <Col key={2} flex={8} style={{backgroundColor: "#f5f5f5"}}>
                <Header user={{userId: "001", userName: "admin", email: "test@gmail.com"}}/>
                <div style={{display: "flex"}}>
                    <div>
                        <Link to={`/history`}>Trở lại</Link>
                        <div>Chi tiết lịch sử gọi API</div>
                        <br/>
                        <div className="detail_information">
                            <div className="detail_information--container">
                                <p>Người Gửi : {detail.user}</p>
                                <p>Ứng Dụng : {detail.application}</p>
                                <p>Api : {detail.api}</p>
                            </div>
                            <div className="detail_information--container">
                                <p>Trạng thái : {detail.status}</p>
                                <p>Phương thức : {detail.method}</p>
                                <p>Thời gian gửi : {moment(detail.createdAt).format('DD-MM-YYYY-HH:mm:SS')}</p>
                                <p>Thời gian trả kết quả : {detail.responseTime}</p>
                            </div>
                        </div>
                        <br></br>
                        <div className="detail_request">
                            <div
                                {...getToggleProps({
                                    onClick: () => setExpanded((prevExpanded) => !prevExpanded),
                                })}
                            >
                                Request
                            </div>

                            <section {...getCollapseProps()}>
                                {
                                    <div>
                                        {img ? <img src={img}></img> : <div></div>}
                                        <pre>{JSON.stringify(detail.request, null, 2)}</pre>
                                    </div>
                                }
                            </section>
                        </div>
                        <br/>
                        <div>
                            <div
                                {...getToggleProps({
                                    onClick: () => setExpanded((prevExpanded) => !prevExpanded),
                                })}
                            >
                                Response
                            </div>
                            <section {...getCollapseProps()}>
                                {
                                    <div>
                                        <pre>{JSON.stringify(detail.response, null, 2)}</pre>
                                    </div>
                                }
                            </section>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default APIHistoryDetail;
