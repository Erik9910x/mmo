// Language/i18n System - English & Vietnamese

const i18n = {
    currentLang: localStorage.getItem('mmo-lang') || 'en',

    translations: {
        en: {
            // Welcome Screen
            welcome_title: 'MMO Experience',
            welcome_subtitle: 'Make Money Online Simulator',
            welcome_description: 'Experience realistic online income paths in a risk-free environment. Learn before you earn!',
            start_challenge: 'Start Challenge',
            simulation_note: '🎮 This is a simulation for educational purposes only',

            // Features
            feature_freelance: 'Freelance',
            feature_affiliate: 'Affiliate',
            feature_dropship: 'Dropship',
            feature_trading: 'Trading',

            // Disclaimer
            disclaimer_title: '⚠️ Educational Simulation',
            disclaimer_text: 'This platform is for educational purposes only. No real money is involved.',
            challenge_rules: 'Challenge Rules',
            rule_energy: '⚡ Energy depletes with each action',
            rule_stress: '😰 Stress increases with risky decisions',
            rule_days: '📅 You have 7 days to prove yourself',
            rule_fail: '💀 Specific fail conditions for each path',
            understand_start: "I Understand, Let's Start",

            // Dashboard
            balance: 'Balance',
            total_profit: 'Total Profit',
            total_loss: 'Total Loss',
            actions: 'Actions',
            day_of: 'Day {current} of {total}',
            energy: 'Energy',
            stress: 'Stress',
            strategy_score: 'Strategy',
            risk_score: 'Risk',

            // Paths Section
            choose_path: 'Choose Your Path',
            path_subtitle: 'Each path has unique challenges and fail conditions',

            // Freelance
            freelance_title: 'Freelance',
            freelance_desc: 'Trade your skills for money. Time management is crucial!',
            freelance_potential: 'Potential: $15-500/job',
            freelance_challenge: '40h time limit',
            time_remaining: 'Time Left',
            reputation: 'Reputation',
            jobs_done: 'Jobs Done',
            choose_skill: 'Choose Your Skill Level',
            skill_higher_pay: 'Higher skills = Higher pay but harder to succeed!',
            beginner: 'Beginner',
            skilled: 'Skilled',
            expert: 'Expert',
            success_rate: 'success rate',
            slower_work: 'Slower',
            normal_work: 'Normal',
            faster_work: 'Faster',
            available_jobs: 'Available Jobs',
            refresh_jobs: 'Refresh',
            take_job: 'Take Job',
            urgent: 'URGENT',
            rest: 'Rest (-4h, recover energy)',

            // Affiliate
            affiliate_title: 'Affiliate Marketing',
            affiliate_desc: 'Build an audience, promote products. Patience required!',
            affiliate_potential: 'Potential: Passive income',
            affiliate_challenge: '14-day deadline',
            actions_today: 'Actions Today',
            days_until_deadline: 'Days Until Deadline',
            daily_traffic: 'Daily Traffic',
            total_spent: 'Total Spent',
            choose_platform: 'Choose ONE Platform',
            goal_visitors: 'Goal: Reach 100+ daily visitors before Day {deadline}',
            base_traffic: 'Base Traffic',
            viral_chance: 'Viral Chance',
            content_cost: 'Content Cost',
            growth_speed: 'Growth',
            create_content: 'Create Content',
            paid_ads: 'Paid Ads',
            engage_community: 'Engage Community',
            collect_earnings: 'Collect Earnings',
            end_day: 'End Day & See Results',
            activity_log: 'Activity Log',
            no_activity: 'No activity yet',

            // Dropshipping
            dropship_title: 'Dropshipping',
            dropship_desc: 'Sell products without inventory. Ad strategy matters!',
            dropship_potential: 'Potential: $50-500/campaign',
            dropship_challenge: '10 ad attempts',
            ad_attempts_left: 'Ad Attempts Left',
            refund_rate: 'Refund Rate',
            max_allowed: 'Max Allowed',
            choose_product: 'Choose a Product to Sell',
            higher_margin_risk: 'Higher margin = Higher refund risk!',
            cost: 'Cost',
            sell_price: 'Sell',
            margin: 'Margin',
            refund_risk: 'Refund Risk',
            set_ad_budget: 'Set Ad Budget',
            budget_desc: 'Higher budget = More reach, but more risk if campaign fails',
            est_reach: 'Est. Reach',
            est_clicks: 'Est. Clicks',
            risk_assessment: 'Risk Assessment',
            product_risk: 'Product Risk',
            current_refund_rate: 'Current Refund Rate',
            campaigns_remaining: 'Campaigns Remaining',
            run_campaign: 'Run Campaign',
            campaign_results: 'Campaign Results',

            // Trading
            trading_title: 'Trading/Crypto',
            trading_desc: 'Buy low, sell high. Discipline is everything!',
            trading_potential: 'Potential: High risk/reward',
            trading_challenge: '15 trades max',
            trades_left: 'Trades Left',
            max_risk_trade: 'Max Risk/Trade',
            rules_broken: 'Rules Broken',
            choose_mode: 'Choose Trading Mode',
            trade_rules: 'trades. Risk max {percent}% per trade!',
            spot_trading: 'Spot Trading',
            spot_no_leverage: 'No leverage',
            spot_no_liquidation: 'Cannot be liquidated',
            spot_steady: 'Lower risk, steady gains',
            futures_trading: 'Futures Trading',
            futures_leverage: 'Up to 10x leverage',
            futures_liquidation: 'Can be LIQUIDATED!',
            futures_high_risk: 'High risk, high reward',
            trade_spot: 'Trade Spot',
            trade_futures: 'Trade Futures',
            market_volatility: 'Market Volatility',
            low: 'Low',
            high: 'High',
            leverage: 'Leverage',
            liquidation_warning: 'Higher leverage = Higher liquidation risk!',
            trade_amount: 'Trade Amount',
            max_without_break: 'Max without rule break',
            risk_warning: 'This exceeds max risk! Will count as rule violation.',
            buy_long: 'BUY / LONG',
            sell_short: 'SELL / SHORT',
            open_position: 'Open Position',
            direction: 'Direction',
            entry_price: 'Entry Price',
            size: 'Size',
            unrealized_pnl: 'Unrealized PnL',
            close_position: 'Close Position',
            risk_rules: 'Risk Rules',

            // Results
            challenge_complete: 'Challenge Complete!',
            your_grade: 'Your Grade',
            final_balance: 'Final Balance',
            days_survived: 'Days Survived',
            total_decisions: 'Total Decisions',
            smart_decisions: 'Smart Decisions',
            reckless_decisions: 'Reckless Decisions',
            best_decision: 'Best Decision',
            biggest_mistake: 'Biggest Mistake',
            reality_check: 'Reality Check',
            reality_message: 'In the real world, online income takes months or years to build. This simulation compressed that journey into minutes. Stay patient, stay disciplined!',
            badges_earned: 'Badges Earned',
            play_again: 'Play Again',

            // Challenge Failed
            challenge_failed: 'Challenge Failed!',
            return_dashboard: 'Return to Dashboard',

            // Fail Messages
            fail_time: 'You ran out of time!',
            fail_reputation: 'Your reputation hit zero!',
            fail_deadline: "Didn't reach 100 visitors before deadline!",
            fail_refund: 'Store banned due to high refund rate!',
            fail_budget: 'No more budget or attempts!',
            fail_rules: 'Too many risk rule violations!',
            fail_liquidated: 'Liquidated! Leverage is dangerous.',

            // Toasts
            toast_started: 'Challenge started! You have $1,000 and 7 days.',
            toast_day_complete: 'Day {day} complete!',
            toast_job_success: 'Job completed!',
            toast_job_failed: 'Job failed!',
            toast_viral: 'YOU WENT VIRAL!',
            toast_liquidated: 'LIQUIDATED!',

            // Misc
            back_dashboard: 'Back to Dashboard',
            recent_activity: 'Recent Activity',
            no_transactions: 'No transactions yet. Start exploring!',
            leaderboard: 'Leaderboard',
            achievements: 'Achievements',
            end_session: 'End Session',
            medium_risk: 'Medium Risk',
            high_risk: 'High Risk',
            low_risk: 'Low Risk',
            free: 'Free',
            language: 'Language'
        },

        vi: {
            // Welcome Screen
            welcome_title: 'MMO Experience',
            welcome_subtitle: 'Mô Phỏng Kiếm Tiền Online',
            welcome_description: 'Trải nghiệm các con đường kiếm tiền online thực tế trong môi trường không rủi ro. Học trước khi kiếm!',
            start_challenge: 'Bắt Đầu Thử Thách',
            simulation_note: '🎮 Đây là mô phỏng chỉ dành cho mục đích giáo dục',

            // Features
            feature_freelance: 'Freelance',
            feature_affiliate: 'Tiếp Thị',
            feature_dropship: 'Dropship',
            feature_trading: 'Giao Dịch',

            // Disclaimer
            disclaimer_title: '⚠️ Mô Phỏng Giáo Dục',
            disclaimer_text: 'Nền tảng này chỉ dành cho mục đích giáo dục. Không có tiền thật.',
            challenge_rules: 'Quy Tắc Thử Thách',
            rule_energy: '⚡ Năng lượng giảm với mỗi hành động',
            rule_stress: '😰 Căng thẳng tăng với quyết định rủi ro',
            rule_days: '📅 Bạn có 7 ngày để chứng minh bản thân',
            rule_fail: '💀 Điều kiện thất bại riêng cho mỗi con đường',
            understand_start: 'Tôi Hiểu, Bắt Đầu Thôi',

            // Dashboard
            balance: 'Số Dư',
            total_profit: 'Tổng Lợi Nhuận',
            total_loss: 'Tổng Thua Lỗ',
            actions: 'Hành Động',
            day_of: 'Ngày {current} / {total}',
            energy: 'Năng Lượng',
            stress: 'Căng Thẳng',
            strategy_score: 'Chiến Lược',
            risk_score: 'Rủi Ro',

            // Paths Section
            choose_path: 'Chọn Con Đường',
            path_subtitle: 'Mỗi con đường có thử thách và điều kiện thất bại riêng',

            // Freelance
            freelance_title: 'Freelance',
            freelance_desc: 'Đổi kỹ năng lấy tiền. Quản lý thời gian là chìa khóa!',
            freelance_potential: 'Tiềm năng: $15-500/việc',
            freelance_challenge: 'Giới hạn 40 giờ',
            time_remaining: 'Thời Gian Còn',
            reputation: 'Uy Tín',
            jobs_done: 'Việc Hoàn Thành',
            choose_skill: 'Chọn Cấp Độ Kỹ Năng',
            skill_higher_pay: 'Kỹ năng cao hơn = Lương cao hơn nhưng khó thành công!',
            beginner: 'Người Mới',
            skilled: 'Có Kinh Nghiệm',
            expert: 'Chuyên Gia',
            success_rate: 'tỷ lệ thành công',
            slower_work: 'Chậm hơn',
            normal_work: 'Bình thường',
            faster_work: 'Nhanh hơn',
            available_jobs: 'Việc Có Sẵn',
            refresh_jobs: 'Làm Mới',
            take_job: 'Nhận Việc',
            urgent: 'GẤP',
            rest: 'Nghỉ ngơi (-4h, hồi phục năng lượng)',

            // Affiliate
            affiliate_title: 'Tiếp Thị Liên Kết',
            affiliate_desc: 'Xây dựng khán giả, quảng bá sản phẩm. Cần kiên nhẫn!',
            affiliate_potential: 'Tiềm năng: Thu nhập thụ động',
            affiliate_challenge: 'Hạn chót 14 ngày',
            actions_today: 'Hành Động Hôm Nay',
            days_until_deadline: 'Ngày Còn Lại',
            daily_traffic: 'Lượt Truy Cập/Ngày',
            total_spent: 'Tổng Chi',
            choose_platform: 'Chọn MỘT Nền Tảng',
            goal_visitors: 'Mục tiêu: Đạt 100+ khách/ngày trước Ngày {deadline}',
            base_traffic: 'Traffic Cơ Bản',
            viral_chance: 'Cơ Hội Viral',
            content_cost: 'Chi Phí Nội Dung',
            growth_speed: 'Tốc Độ',
            create_content: 'Tạo Nội Dung',
            paid_ads: 'Quảng Cáo Trả Phí',
            engage_community: 'Tương Tác Cộng Đồng',
            collect_earnings: 'Thu Tiền',
            end_day: 'Kết Thúc Ngày',
            activity_log: 'Nhật Ký Hoạt Động',
            no_activity: 'Chưa có hoạt động',

            // Dropshipping
            dropship_title: 'Dropshipping',
            dropship_desc: 'Bán hàng không cần kho. Chiến lược quảng cáo quan trọng!',
            dropship_potential: 'Tiềm năng: $50-500/chiến dịch',
            dropship_challenge: '10 lần chạy quảng cáo',
            ad_attempts_left: 'Số Lần Quảng Cáo Còn',
            refund_rate: 'Tỷ Lệ Hoàn Tiền',
            max_allowed: 'Tối Đa Cho Phép',
            choose_product: 'Chọn Sản Phẩm Để Bán',
            higher_margin_risk: 'Lợi nhuận cao = Rủi ro hoàn tiền cao!',
            cost: 'Giá Vốn',
            sell_price: 'Giá Bán',
            margin: 'Lợi Nhuận',
            refund_risk: 'Rủi Ro Hoàn Tiền',
            set_ad_budget: 'Đặt Ngân Sách Quảng Cáo',
            budget_desc: 'Ngân sách cao = Tiếp cận nhiều, nhưng rủi ro nếu thất bại',
            est_reach: 'Ước Tính Tiếp Cận',
            est_clicks: 'Ước Tính Nhấp',
            risk_assessment: 'Đánh Giá Rủi Ro',
            product_risk: 'Rủi Ro Sản Phẩm',
            current_refund_rate: 'Tỷ Lệ Hoàn Tiền Hiện Tại',
            campaigns_remaining: 'Chiến Dịch Còn Lại',
            run_campaign: 'Chạy Chiến Dịch',
            campaign_results: 'Kết Quả Chiến Dịch',

            // Trading
            trading_title: 'Giao Dịch/Crypto',
            trading_desc: 'Mua thấp, bán cao. Kỷ luật là tất cả!',
            trading_potential: 'Tiềm năng: Rủi ro/thưởng cao',
            trading_challenge: 'Tối đa 15 giao dịch',
            trades_left: 'Giao Dịch Còn Lại',
            max_risk_trade: 'Rủi Ro Tối Đa/Lệnh',
            rules_broken: 'Quy Tắc Bị Phá',
            choose_mode: 'Chọn Chế Độ Giao Dịch',
            trade_rules: 'giao dịch. Rủi ro tối đa {percent}% mỗi lệnh!',
            spot_trading: 'Giao Dịch Spot',
            spot_no_leverage: 'Không đòn bẩy',
            spot_no_liquidation: 'Không bị thanh lý',
            spot_steady: 'Rủi ro thấp, lợi nhuận ổn định',
            futures_trading: 'Giao Dịch Futures',
            futures_leverage: 'Đòn bẩy lên đến 10x',
            futures_liquidation: 'Có thể bị THANH LÝ!',
            futures_high_risk: 'Rủi ro cao, thưởng cao',
            trade_spot: 'Giao Dịch Spot',
            trade_futures: 'Giao Dịch Futures',
            market_volatility: 'Biến Động Thị Trường',
            low: 'Thấp',
            high: 'Cao',
            leverage: 'Đòn Bẩy',
            liquidation_warning: 'Đòn bẩy cao = Rủi ro thanh lý cao!',
            trade_amount: 'Số Tiền Giao Dịch',
            max_without_break: 'Tối đa không phạm quy',
            risk_warning: 'Vượt quá rủi ro tối đa! Sẽ tính là vi phạm quy tắc.',
            buy_long: 'MUA / LONG',
            sell_short: 'BÁN / SHORT',
            open_position: 'Vị Thế Đang Mở',
            direction: 'Hướng',
            entry_price: 'Giá Vào',
            size: 'Khối Lượng',
            unrealized_pnl: 'Lãi/Lỗ Chưa Chốt',
            close_position: 'Đóng Vị Thế',
            risk_rules: 'Quy Tắc Rủi Ro',

            // Results
            challenge_complete: 'Hoàn Thành Thử Thách!',
            your_grade: 'Điểm Của Bạn',
            final_balance: 'Số Dư Cuối',
            days_survived: 'Ngày Sống Sót',
            total_decisions: 'Tổng Quyết Định',
            smart_decisions: 'Quyết Định Thông Minh',
            reckless_decisions: 'Quyết Định Liều Lĩnh',
            best_decision: 'Quyết Định Tốt Nhất',
            biggest_mistake: 'Sai Lầm Lớn Nhất',
            reality_check: 'Kiểm Tra Thực Tế',
            reality_message: 'Trong thực tế, thu nhập online cần nhiều tháng hoặc năm để xây dựng. Mô phỏng này nén hành trình đó thành vài phút. Hãy kiên nhẫn, hãy kỷ luật!',
            badges_earned: 'Huy Hiệu Đạt Được',
            play_again: 'Chơi Lại',

            // Challenge Failed
            challenge_failed: 'Thử Thách Thất Bại!',
            return_dashboard: 'Quay Về Bảng Điều Khiển',

            // Fail Messages
            fail_time: 'Bạn đã hết thời gian!',
            fail_reputation: 'Uy tín của bạn về 0!',
            fail_deadline: 'Không đạt 100 khách trước hạn chót!',
            fail_refund: 'Cửa hàng bị khóa do tỷ lệ hoàn tiền cao!',
            fail_budget: 'Hết ngân sách và số lần thử!',
            fail_rules: 'Vi phạm quy tắc rủi ro quá nhiều!',
            fail_liquidated: 'Bị thanh lý! Đòn bẩy rất nguy hiểm.',

            // Toasts
            toast_started: 'Thử thách bắt đầu! Bạn có $1,000 và 7 ngày.',
            toast_day_complete: 'Ngày {day} hoàn thành!',
            toast_job_success: 'Hoàn thành việc!',
            toast_job_failed: 'Việc thất bại!',
            toast_viral: 'BẠN ĐÃ VIRAL!',
            toast_liquidated: 'BỊ THANH LÝ!',

            // Misc
            back_dashboard: 'Quay Về Bảng Điều Khiển',
            recent_activity: 'Hoạt Động Gần Đây',
            no_transactions: 'Chưa có giao dịch. Bắt đầu khám phá!',
            leaderboard: 'Bảng Xếp Hạng',
            achievements: 'Thành Tựu',
            end_session: 'Kết Thúc',
            medium_risk: 'Rủi Ro Trung Bình',
            high_risk: 'Rủi Ro Cao',
            low_risk: 'Rủi Ro Thấp',
            free: 'Miễn Phí',
            language: 'Ngôn Ngữ'
        }
    },

    // Get translation
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || this.translations['en'][key] || key;

        // Replace parameters like {current}, {total}, etc.
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    },

    // Switch language
    setLang(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('mmo-lang', lang);
            return true;
        }
        return false;
    },

    // Toggle between languages
    toggle() {
        const newLang = this.currentLang === 'en' ? 'vi' : 'en';
        this.setLang(newLang);
        return newLang;
    },

    // Get current language
    getLang() {
        return this.currentLang;
    }
};

window.i18n = i18n;
